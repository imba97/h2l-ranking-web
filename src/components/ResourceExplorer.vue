<style scoped>
.resource-explorer {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: #1a1a1a;
  border-left: 1px solid #333;
  display: flex;
  flex-direction: column;
  z-index: 10;
  transition: width 0.3s ease;
}

.resource-explorer--collapsed {
  width: 40px;
}

.resource-explorer__toggle {
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-right: none;
  border-radius: 8px 0 0 8px;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.resource-explorer__toggle:hover {
  color: #fff;
  background: #252525;
}

.resource-explorer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.resource-source {
  padding: 12px;
  border-bottom: 1px solid #333;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn--primary {
  background: #3b82f6;
  color: white;
}

.btn--primary:hover {
  background: #2563eb;
}

.btn--secondary {
  background: #333;
  color: #ddd;
}

.btn--secondary:hover {
  background: #404040;
}

.btn--small {
  width: 32px;
  height: 32px;
  padding: 0;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.url-input {
  display: flex;
  gap: 4px;
}

.url-input input {
  flex: 1;
  padding: 6px 10px;
  background: #252525;
  border: 1px solid #333;
  border-radius: 6px;
  color: #ddd;
  font-size: 12px;
}

.url-input input:focus {
  outline: none;
  border-color: #3b82f6;
}

.hidden {
  display: none;
}

.resource-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #888;
}

.resource-grid {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: min-content;
  align-content: start;
  gap: 8px;
}

.resource-item-wrapper {
  position: relative;
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
}

.resource-item {
  width: 100%;
  height: 100%;
  background: #252525;
  border-radius: 6px;
  cursor: grab;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}

.resource-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.resource-item:active {
  cursor: grabbing;
}

.resource-item.is-dragging {
  opacity: 0.5;
}

.resource-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.resource-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px;
  border-radius: 6px;
  pointer-events: none;
}

.resource-item-wrapper:hover .resource-overlay {
  opacity: 1;
}

.resource-overlay .resource-delete {
  pointer-events: auto;
}

.resource-name {
  font-size: 10px;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resource-delete {
  align-self: flex-end;
  width: 24px;
  height: 24px;
  background: rgba(239, 68, 68, 0.8);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.resource-delete:hover {
  background: rgba(239, 68, 68, 1);
}

.resource-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
  padding: 40px 20px;
}

.resource-empty span {
  font-size: 32px;
}

.resource-stats {
  padding: 8px 12px;
  border-top: 1px solid #333;
  font-size: 11px;
  color: #666;
  text-align: center;
  background: #151515;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.resource-stats__info {
  flex: 1;
}

.resource-stats__clear {
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.resource-stats__clear:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.resource-stats__clear:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.resource-stats__clear svg {
  width: 16px;
  height: 16px;
}
</style>

<template>
  <div
    class="resource-explorer"
    :class="{ 'resource-explorer--collapsed': !explorerVisible }"
    @paste="handlePaste"
  >
    <button
      class="resource-explorer__toggle"
      @click="emit('toggle')"
    >
      {{ explorerVisible ? '»' : '«' }}
    </button>

    <div v-if="explorerVisible" class="resource-explorer__content">
      <div class="resource-source">
        <button
          class="btn btn--primary"
          @click="handleFileSelect"
        >
          <span class="i-carbon-upload" />
          Upload
        </button>
        <button
          class="btn btn--secondary"
          @click="handleFolderSelect"
        >
          <span class="i-carbon-folder" />
          Folder
        </button>

        <div class="url-input">
          <input
            v-model="urlInput"
            type="text"
            placeholder="Paste image URL..."
            @keyup.enter="handleUrlSubmit"
          >
          <button
            class="btn btn--small"
            :disabled="!urlInput.trim()"
            @click="handleUrlSubmit"
          >
            <span class="i-carbon-add" />
          </button>
        </div>

        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="onFileChange"
        >
        <input
          ref="folderInputRef"
          type="file"
          webkitdirectory
          multiple
          class="hidden"
          @change="onFolderChange"
        >
      </div>

      <div v-if="isLoading" class="resource-loading">
        <span class="i-carbon-circle-dash animate-spin" />
        Loading...
      </div>

      <div v-else class="resource-grid">
        <div
          v-for="image in images"
          :key="image.id"
          class="resource-item-wrapper"
        >
          <div
            class="resource-item"
            :class="{ 'is-dragging': draggingId === image.id }"
            draggable="true"
            @dragstart="handleDragStart(image, $event)"
            @dragend="handleDragEnd"
          >
            <img :src="image.src" :alt="image.name">
          </div>
          <div class="resource-overlay">
            <span class="resource-name" :title="image.name">{{ image.name }}</span>
            <button
              class="resource-delete"
              @click.stop="emit('deleteRequest', image.id, image.name)"
            >
              <span class="i-carbon-trash-can" />
            </button>
          </div>
        </div>

        <div v-if="images.length === 0" class="resource-empty">
          <span class="i-carbon-image" />
          <p>No images yet</p>
          <p class="text-sm text-gray-400">
            Upload images or paste URLs
          </p>
        </div>
      </div>

      <div class="resource-stats">
        <span class="resource-stats__info">
          {{ images.length }} images · {{ formatSize(totalSize) }}
        </span>
        <button
          class="resource-stats__clear"
          :disabled="images.length === 0"
          :title="images.length === 0 ? 'No images to clear' : 'Clear all images'"
          @click="handleClearAll"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 清空确认弹窗 -->
    <ConfirmDialog
      :show="clearDialog.show"
      title="清空所有图片"
      message="确定要清空所有图片吗？此操作不可撤销。"
      @confirm="handleConfirmClearAll"
      @cancel="clearDialog.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import type { ImageResource } from '~/types'
import { computed } from 'vue'

const props = defineProps<{
  images: ImageResource[]
  isLoading: boolean
  explorerVisible: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
  (e: 'upload', files: File[]): void
  (e: 'addFromUrl', url: string): void
  (e: 'deleteRequest', id: string, name: string): void
  (e: 'clearAllRequest'): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const folderInputRef = ref<HTMLInputElement | null>(null)
const urlInput = ref('')
const draggingId = ref<string | null>(null)
const clearDialog = ref({ show: false })

function handleFileSelect() {
  fileInputRef.value?.click()
}

function handleFolderSelect() {
  folderInputRef.value?.click()
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    emit('upload', [...files])
  }
  target.value = ''
}

function onFolderChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    const imageFiles = [...files].filter(f => f.type.startsWith('image/'))
    if (imageFiles.length > 0) {
      emit('upload', imageFiles)
    }
  }
  target.value = ''
}

function handleUrlSubmit() {
  const url = urlInput.value.trim()
  if (url) {
    emit('addFromUrl', url)
    urlInput.value = ''
  }
}

function handleClearAll() {
  if (props.images.length === 0)
    return
  clearDialog.value.show = true
}

function handleConfirmClearAll() {
  clearDialog.value.show = false
  emit('clearAllRequest')
}

async function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items)
    return

  const files: File[] = []
  for (const item of [...items]) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        files.push(file)
      }
    }
  }

  if (files.length > 0) {
    e.preventDefault()
    emit('upload', files)
  }
}

// 拖拽开始
function handleDragStart(image: ImageResource, e: DragEvent) {
  draggingId.value = image.id

  if (e.dataTransfer && e.currentTarget) {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'resource',
      id: image.id,
      src: image.src,
      name: image.name
    }))

    // 获取 DOM 中已加载的 img 元素
    const target = e.currentTarget as HTMLElement
    const imgEl = target.querySelector('img') as HTMLImageElement

    if (imgEl) {
      // 创建预览元素，使用与左侧相同的样式
      const preview = document.createElement('div')
      preview.style.cssText = `
        width: 100px;
        height: 100px;
        background-color: #333;
        border-radius: 8px;
        overflow: hidden;
        position: fixed;
        top: -1000px;
        left: -1000px;
        pointer-events: none;
      `
      const previewImg = imgEl.cloneNode(true) as HTMLImageElement
      previewImg.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
      `
      preview.appendChild(previewImg)
      document.body.appendChild(preview)

      // 使用预览元素
      e.dataTransfer.setDragImage(preview, 50, 50)

      // 清理
      setTimeout(() => {
        document.body.removeChild(preview)
      }, 100)
    }
  }
}

// 拖拽结束
function handleDragEnd() {
  draggingId.value = null
}

function formatSize(bytes: number): string {
  if (bytes < 1024)
    return `${bytes} B`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const totalSize = computed(() => {
  return props.images.reduce((sum, img) => sum + img.size, 0)
})
</script>
