import type { ImageResource, StoredImage } from '~/types'

const DB_NAME = 'h2l-ranking-images'
const STORE_NAME = 'images'
const MAX_SINGLE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_TOTAL_SIZE = 100 * 1024 * 1024 // 100MB

class ImageStorageService {
  private db: IDBDatabase | null = null
  private blobCache = new Map<string, string>()

  async init(): Promise<void> {
    if (this.db)
      return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1)

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('createdAt', 'createdAt', { unique: false })
        }
      }
    })
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.db) {
      await this.init()
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
  }

  private validateFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed')
    }

    if (file.size > MAX_SINGLE_SIZE) {
      throw new Error(`Image size exceeds ${MAX_SINGLE_SIZE / 1024 / 1024}MB limit`)
    }
  }

  private async getTotalSize(): Promise<number> {
    await this.ensureInitialized()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAllKeys()

      request.onsuccess = async () => {
        let total = 0
        const keys = request.result
        for (const key of keys) {
          const size = await this.getImageSize(key as string)
          total += size
        }
        resolve(total)
      }

      request.onerror = () => reject(new Error('Failed to calculate total size'))
    })
  }

  private async getImageSize(id: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => {
        const data = request.result as StoredImage | undefined
        resolve(data?.size || 0)
      }

      request.onerror = () => reject(new Error('Failed to get image size'))
    })
  }

  async saveImage(file: File): Promise<ImageResource> {
    await this.ensureInitialized()

    this.validateFile(file)

    const totalSize = await this.getTotalSize()
    if (totalSize + file.size > MAX_TOTAL_SIZE) {
      throw new Error(`Storage limit exceeded. Maximum ${MAX_TOTAL_SIZE / 1024 / 1024}MB allowed`)
    }

    const id = this.generateId()
    const arrayBuffer = await file.arrayBuffer()
    const createdAt = Date.now()

    const storedImage: StoredImage = {
      id,
      name: file.name,
      mimeType: file.type,
      data: arrayBuffer,
      createdAt,
      size: file.size
    }

    await this.saveToDB(storedImage)

    const blob = new Blob([arrayBuffer], { type: file.type })
    const blobUrl = URL.createObjectURL(blob)
    this.blobCache.set(id, blobUrl)

    return {
      id,
      name: file.name,
      src: blobUrl,
      type: 'memfs',
      createdAt,
      size: file.size,
      mimeType: file.type
    }
  }

  async saveFromUrl(url: string): Promise<ImageResource | null> {
    try {
      const response = await fetch(url, { mode: 'cors' })
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`)
      }

      const blob = await response.blob()
      const file = new File([blob], this.getFileNameFromUrl(url), { type: blob.type })
      return await this.saveImage(file)
    }
    catch (e) {
      console.error('Failed to save image from URL:', e)
      throw e
    }
  }

  private getFileNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const filename = pathname.split('/').pop()
      if (filename && filename.includes('.')) {
        return filename
      }
    }
    catch {
      // ignore
    }
    return `image-${Date.now()}.png`
  }

  private saveToDB(image: StoredImage): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(image)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to save to IndexedDB'))
    })
  }

  async getImage(id: string): Promise<Blob | null> {
    await this.ensureInitialized()

    if (this.blobCache.has(id)) {
      const url = this.blobCache.get(id)!
      return await this.blobFromUrl(url)
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => {
        const data = request.result as StoredImage | undefined
        if (data) {
          const blob = new Blob([data.data], { type: data.mimeType })
          resolve(blob)
        }
        else {
          resolve(null)
        }
      }

      request.onerror = () => reject(new Error('Failed to get image'))
    })
  }

  async getImageUrl(id: string): Promise<string | null> {
    if (this.blobCache.has(id)) {
      return this.blobCache.get(id)!
    }

    const blob = await this.getImage(id)
    if (!blob)
      return null

    const url = URL.createObjectURL(blob)
    this.blobCache.set(id, url)
    return url
  }

  async deleteImage(id: string): Promise<void> {
    await this.ensureInitialized()

    if (this.blobCache.has(id)) {
      URL.revokeObjectURL(this.blobCache.get(id)!)
      this.blobCache.delete(id)
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to delete image'))
    })
  }

  async listImages(): Promise<ImageResource[]> {
    await this.ensureInitialized()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = async () => {
        const storedImages = request.result as StoredImage[]
        const resources: ImageResource[] = []

        for (const img of storedImages) {
          let blobUrl = this.blobCache.get(img.id)
          if (!blobUrl) {
            const blob = new Blob([img.data], { type: img.mimeType })
            blobUrl = URL.createObjectURL(blob)
            this.blobCache.set(img.id, blobUrl)
          }

          resources.push({
            id: img.id,
            name: img.name,
            src: blobUrl,
            type: 'memfs',
            createdAt: img.createdAt,
            size: img.size,
            mimeType: img.mimeType
          })
        }

        resources.sort((a, b) => b.createdAt - a.createdAt)
        resolve(resources)
      }

      request.onerror = () => reject(new Error('Failed to list images'))
    })
  }

  private async blobFromUrl(url: string): Promise<Blob> {
    const response = await fetch(url)
    return response.blob()
  }

  clearCache(): void {
    for (const url of this.blobCache.values()) {
      URL.revokeObjectURL(url)
    }
    this.blobCache.clear()
  }

  async clearAllImages(): Promise<void> {
    await this.ensureInitialized()

    // 清理 blob 缓存
    this.clearCache()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to clear all images'))
    })
  }
}

export const imageStorageService = new ImageStorageService()
