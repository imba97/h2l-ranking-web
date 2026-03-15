import type { ImageResource } from '~/types'
import { imageStorageService } from '~/services/imageStorage'

export interface ResourcesState {
  images: ImageResource[]
  isLoading: boolean
  error: string | null
}

export const useResourcesStore = defineStore('resources', () => {
  const images = ref<ImageResource[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 加载状态（内部使用）
  const $state = {
    _initialized: false
  }

  const totalSize = computed(() => {
    return images.value.reduce((sum, img) => sum + img.size, 0)
  })

  const loadAll = async () => {
    if ($state._initialized && images.value.length > 0)
      return

    isLoading.value = true
    error.value = null
    try {
      const list = await imageStorageService.listImages()
      images.value = list
      $state._initialized = true
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load images'
    }
    finally {
      isLoading.value = false
    }
  }

  const addImage = async (file: File): Promise<ImageResource | null> => {
    isLoading.value = true
    error.value = null
    try {
      const resource = await imageStorageService.saveImage(file)
      images.value.push(resource)
      return resource
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save image'
      return null
    }
    finally {
      isLoading.value = false
    }
  }

  const addFromUrl = async (url: string): Promise<ImageResource | null> => {
    isLoading.value = true
    error.value = null
    try {
      const resource = await imageStorageService.saveFromUrl(url)
      if (resource) {
        images.value.push(resource)
      }
      return resource
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load image from URL'
      return null
    }
    finally {
      isLoading.value = false
    }
  }

  const removeImage = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await imageStorageService.deleteImage(id)
      images.value = images.value.filter(img => img.id !== id)
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete image'
    }
    finally {
      isLoading.value = false
    }
  }

  const clearAll = async () => {
    isLoading.value = true
    error.value = null
    try {
      await imageStorageService.clearAllImages()
      images.value = []
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to clear all images'
    }
    finally {
      isLoading.value = false
    }
  }

  const getImageUrl = (id: string): string | null => {
    const img = images.value.find(i => i.id === id)
    return img?.src || null
  }

  return {
    images,
    isLoading,
    error,
    totalSize,
    loadAll,
    addImage,
    addFromUrl,
    removeImage,
    clearAll,
    getImageUrl
  }
})
