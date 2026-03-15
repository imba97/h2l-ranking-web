<style scoped>
.ranking-page {
  display: flex;
  height: 100dvh;
  background: #0f0f0f;
  color: #ddd;
  overflow: hidden;
}

.ranking-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  margin-right: 280px;
  min-width: 0;
}

.ranking-content {
  width: 100%;
  max-width: 1200px;
}

.ranking-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  font-size: 13px;
  color: #666;
}

.ranking-links a {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.ranking-links a:hover {
  color: #3b82f6;
}

.ranking-links__dot {
  color: #444;
}

.h2l-ranking {
  width: 100%;
  max-height: 100%;
}

.h2l-ranking__items {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  min-height: 100%;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.h2l-ranking__items.is-drag-over {
  background-color: rgba(59, 130, 246, 0.15);
  box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.6);
}

.h2l-ranking__items::-webkit-scrollbar {
  display: none;
}

.h2l-ranking__items {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/* 插入指示器 - 显示在目标项左侧的竖线 */
.h2l-ranking__item.is-drop-before::after {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 80px;
  background: #3b82f6;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
  z-index: 100;
  pointer-events: none;
}

.h2l-ranking__item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background-color: #333;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s, opacity 0.2s;
}

.h2l-ranking__item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.h2l-ranking__item:active {
  cursor: grabbing;
}

.h2l-ranking__item.is-dragging {
  opacity: 0.5;
}

.h2l-ranking__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  border-radius: 8px;
}

/* 覆盖 h2l-ranking 组件的样式，增大尺寸 */
:deep(.h2l-ranking__row) {
  height: 124px;
}

:deep(.h2l-ranking__label) {
  height: 124px;
  font-size: 32px;
}

:deep(.h2l-ranking__labels) {
  max-width: 140px;
  min-width: 120px;
}

/* 垃圾箱 */
.trash-bin {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.2);
  border: 2px solid rgba(239, 68, 68, 0.6);
  border-radius: 50%;
  color: #ef4444;
  transition: all 0.2s ease;
  z-index: 100;
}

.trash-bin svg {
  width: 40px;
  height: 40px;
}

.trash-bin.is-drag-over {
  background: rgba(239, 68, 68, 0.4);
  border-color: #ef4444;
  transform: translateX(-50%) scale(1.1);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}
</style>

<template>
  <div class="ranking-page">
    <div class="ranking-area" :style="{ marginRight: explorerVisible ? '280px' : '40px' }">
      <div class="ranking-content">
        <H2lRanking ref="h2lRankingRef" :rankings="rankingStore.rankings">
          <!-- Hang -->
          <template #hang>
            <div
              class="h2l-ranking__items"
              :class="{ 'is-drag-over': dragOverTier === 'hang' }"
              @dragover="handleDragOverRowContainer('hang', $event)"
              @dragleave="handleDragLeaveRow('hang', $event)"
              @drop="handleDrop('hang', $event)"
              @wheel="handleWheel"
            >
              <template v-for="(item, index) in rankingStore.rankings.hang" :key="`hang-${index}`">
                <div
                  class="h2l-ranking__item"
                  :class="{
                    'is-dragging': draggedItem?.tier === 'hang' && draggedItem.index === index,
                    'is-drop-before': dragOverIndex.hang === index
                  }"
                  draggable="true"
                  :title="item.title"
                  @click="openViewer(item.cover, item.url, item.title, item.description)"
                  @dragstart="handleDragStart('hang', index, $event)"
                  @dragend="handleDragEnd"
                  @dragover="handleDragOverItem('hang', index, $event)"
                  @drop="handleDropOnItem('hang', index, $event)"
                >
                  <img :src="item.cover" :alt="item.title">
                </div>
              </template>
            </div>
          </template>

          <!-- Upper -->
          <template #upper>
            <div
              class="h2l-ranking__items"
              :class="{ 'is-drag-over': dragOverTier === 'upper' }"
              @dragover="handleDragOverRowContainer('upper', $event)"
              @dragleave="handleDragLeaveRow('upper', $event)"
              @drop="handleDrop('upper', $event)"
              @wheel="handleWheel"
            >
              <template v-for="(item, index) in rankingStore.rankings.upper" :key="`upper-${index}`">
                <div
                  class="h2l-ranking__item"
                  :class="{
                    'is-dragging': draggedItem?.tier === 'upper' && draggedItem.index === index,
                    'is-drop-before': dragOverIndex.upper === index
                  }"
                  draggable="true"
                  :title="item.title"
                  @click="openViewer(item.cover, item.url, item.title, item.description)"
                  @dragstart="handleDragStart('upper', index, $event)"
                  @dragend="handleDragEnd"
                  @dragover="handleDragOverItem('upper', index, $event)"
                  @drop="handleDropOnItem('upper', index, $event)"
                >
                  <img :src="item.cover" :alt="item.title">
                </div>
              </template>
            </div>
          </template>

          <!-- Middle -->
          <template #middle>
            <div
              class="h2l-ranking__items"
              :class="{ 'is-drag-over': dragOverTier === 'middle' }"
              @dragover="handleDragOverRowContainer('middle', $event)"
              @dragleave="handleDragLeaveRow('middle', $event)"
              @drop="handleDrop('middle', $event)"
              @wheel="handleWheel"
            >
              <template v-for="(item, index) in rankingStore.rankings.middle" :key="`middle-${index}`">
                <div
                  class="h2l-ranking__item"
                  :class="{
                    'is-dragging': draggedItem?.tier === 'middle' && draggedItem.index === index,
                    'is-drop-before': dragOverIndex.middle === index
                  }"
                  draggable="true"
                  :title="item.title"
                  @click="openViewer(item.cover, item.url, item.title, item.description)"
                  @dragstart="handleDragStart('middle', index, $event)"
                  @dragend="handleDragEnd"
                  @dragover="handleDragOverItem('middle', index, $event)"
                  @drop="handleDropOnItem('middle', index, $event)"
                >
                  <img :src="item.cover" :alt="item.title">
                </div>
              </template>
            </div>
          </template>

          <!-- Lower -->
          <template #lower>
            <div
              class="h2l-ranking__items"
              :class="{ 'is-drag-over': dragOverTier === 'lower' }"
              @dragover="handleDragOverRowContainer('lower', $event)"
              @dragleave="handleDragLeaveRow('lower', $event)"
              @drop="handleDrop('lower', $event)"
              @wheel="handleWheel"
            >
              <template v-for="(item, index) in rankingStore.rankings.lower" :key="`lower-${index}`">
                <div
                  class="h2l-ranking__item"
                  :class="{
                    'is-dragging': draggedItem?.tier === 'lower' && draggedItem.index === index,
                    'is-drop-before': dragOverIndex.lower === index
                  }"
                  draggable="true"
                  :title="item.title"
                  @click="openViewer(item.cover, item.url, item.title, item.description)"
                  @dragstart="handleDragStart('lower', index, $event)"
                  @dragend="handleDragEnd"
                  @dragover="handleDragOverItem('lower', index, $event)"
                  @drop="handleDropOnItem('lower', index, $event)"
                >
                  <img :src="item.cover" :alt="item.title">
                </div>
              </template>
            </div>
          </template>

          <!-- La -->
          <template #la>
            <div
              class="h2l-ranking__items"
              :class="{ 'is-drag-over': dragOverTier === 'la' }"
              @dragover="handleDragOverRowContainer('la', $event)"
              @dragleave="handleDragLeaveRow('la', $event)"
              @drop="handleDrop('la', $event)"
              @wheel="handleWheel"
            >
              <template v-for="(item, index) in rankingStore.rankings.la" :key="`la-${index}`">
                <div
                  class="h2l-ranking__item"
                  :class="{
                    'is-dragging': draggedItem?.tier === 'la' && draggedItem.index === index,
                    'is-drop-before': dragOverIndex.la === index
                  }"
                  draggable="true"
                  :title="item.title"
                  @click="openViewer(item.cover, item.url, item.title, item.description)"
                  @dragstart="handleDragStart('la', index, $event)"
                  @dragend="handleDragEnd"
                  @dragover="handleDragOverItem('la', index, $event)"
                  @drop="handleDropOnItem('la', index, $event)"
                >
                  <img :src="item.cover" :alt="item.title">
                </div>
              </template>
            </div>
          </template>
        </H2lRanking>

        <div class="ranking-links">
          <a href="https://github.com/imba97/h2l-ranking-web" target="_blank" rel="noopener">
            <span class="i-mdi-github" />
            Github
          </a>
          <span class="ranking-links__dot">·</span>
          <a href="https://github.com/imba97/h2l-ranking" target="_blank" rel="noopener">
            <span class="i-mingcute-plugin-2-fill" />
            组件
          </a>
        </div>
      </div>
    </div>

    <!-- 垃圾箱 -->
    <div
      v-if="draggedItem"
      class="trash-bin"
      :class="{ 'is-drag-over': dragOverTrash }"
      @dragover="handleDragOverTrash"
      @dragleave="handleDragLeaveTrash"
      @drop="handleDropOnTrash"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <ResourceExplorer
      :images="resourcesStore.images"
      :is-loading="resourcesStore.isLoading"
      :explorer-visible="explorerVisible"
      @toggle="explorerVisible = !explorerVisible"
      @upload="handleUpload"
      @add-from-url="handleAddFromUrl"
      @delete-request="handleDeleteImageRequest"
      @clear-all-request="handleClearAll"
    />

    <ConfirmDialog
      :show="deleteDialog.show"
      title="删除图片"
      :message="`确定要删除「${deleteDialog.imageName}」吗？同时会移除左侧排行榜中的引用。`"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { RankingTier } from '~/types'
import H2lRanking from 'h2l-ranking'
import { onMounted, ref } from 'vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import ResourceExplorer from '~/components/ResourceExplorer.vue'
import { useRankingStore } from '~/stores/ranking'
import { useResourcesStore } from '~/stores/resources'
import 'h2l-ranking/style.css'

const rankingStore = useRankingStore()
const resourcesStore = useResourcesStore()
const h2lRankingRef = ref()

const explorerVisible = ref(true)
const dragOverTier = ref<RankingTier | null>(null)
const draggedItem = ref<{ tier: RankingTier, index: number } | null>(null)
const dragOverTrash = ref(false)
const dragOverIndex = ref<Record<RankingTier, number>>({
  hang: -1,
  upper: -1,
  middle: -1,
  lower: -1,
  la: -1
})

// 删除确认对话框
const deleteDialog = ref({
  show: false,
  imageId: '',
  imageName: ''
})

onMounted(async () => {
  await rankingStore.loadFromStorage()
  await resourcesStore.loadAll()
})

// 打开图片查看器
function openViewer(cover: string, url?: string, title?: string, description?: string) {
  h2lRankingRef.value?.openViewer(cover, url, title, description)
}

// 拖拽开始
function handleDragStart(tier: RankingTier, index: number, e: DragEvent) {
  const item = rankingStore.rankings[tier][index]
  draggedItem.value = { tier, index }
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'ranking-item',
      tier,
      index,
      item
    }))
  }
}

// 拖拽结束
function handleDragEnd() {
  draggedItem.value = null
  dragOverTier.value = null
  dragOverTrash.value = false
  Object.keys(dragOverIndex.value).forEach((key) => {
    dragOverIndex.value[key as RankingTier] = -1
  })
}

// 拖拽经过垃圾箱
function handleDragOverTrash(e: DragEvent) {
  e.preventDefault()
  dragOverTrash.value = true
}

// 拖拽离开垃圾箱
function handleDragLeaveTrash(e: DragEvent) {
  const relatedTarget = e.relatedTarget as HTMLElement
  const currentTarget = e.currentTarget as HTMLElement
  if (!currentTarget.contains(relatedTarget)) {
    dragOverTrash.value = false
  }
}

// 放置到垃圾箱（删除）
function handleDropOnTrash(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!draggedItem.value)
    return

  const { tier } = draggedItem.value
  rankingStore.removeItem(tier, draggedItem.value.index)

  // 清除该行的指示器状态
  dragOverIndex.value[tier] = -1

  handleDragEnd()
}

// 拖拽离开行
function handleDragLeaveRow(tier: RankingTier, e: DragEvent) {
  const relatedTarget = e.relatedTarget as HTMLElement
  const currentTarget = e.currentTarget as HTMLElement
  if (!currentTarget.contains(relatedTarget)) {
    dragOverTier.value = null
    dragOverIndex.value[tier] = -1
  }
}

// 拖拽经过项（用于排序）
function handleDragOverItem(tier: RankingTier, index: number, e: DragEvent) {
  e.preventDefault()
  // 同等级拖拽时，不显示自身指示器
  // 跨等级拖拽时，显示指示器
  if (draggedItem.value?.tier === tier) {
    if (draggedItem.value.index !== index) {
      dragOverIndex.value[tier] = index
    }
  }
  else {
    // 跨等级拖拽，显示指示器
    dragOverIndex.value[tier] = index
  }
}

// 拖拽经过行容器
function handleDragOverRowContainer(tier: RankingTier, e: DragEvent) {
  e.preventDefault()
  dragOverTier.value = tier

  // 检查鼠标是否在任何 item 上
  const target = e.currentTarget as HTMLElement
  const items = target.querySelectorAll('.h2l-ranking__item')
  let isOverAnyItem = false

  for (const item of [...items]) {
    const rect = item.getBoundingClientRect()
    if (e.clientX >= rect.left && e.clientX <= rect.right
      && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      isOverAnyItem = true
      break
    }
  }

  // 如果不在任何 item 上，清除指示器
  if (!isOverAnyItem) {
    dragOverIndex.value[tier] = -1
  }
}

// 放置到项上（用于排序）
function handleDropOnItem(tier: RankingTier, toIndex: number, e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()

  if (!draggedItem.value)
    return

  const { tier: fromTier, index: fromIndex } = draggedItem.value

  if (fromTier === tier && fromIndex !== toIndex) {
    // 同一行内排序
    rankingStore.reorderItem(tier, fromIndex, toIndex)
  }
  else if (fromTier !== tier) {
    // 跨行移动 - 插入到指定位置
    rankingStore.moveItem(fromTier, fromIndex, tier, toIndex)
  }

  handleDragEnd()
}

// 放置到行上
function handleDrop(tier: RankingTier, e: DragEvent) {
  e.preventDefault()
  dragOverTier.value = null

  try {
    const data = JSON.parse(e.dataTransfer?.getData('application/json') || '{}')

    if (data.type === 'resource') {
      // 从资源管理器拖入 - 追加到末尾
      rankingStore.addItem(tier, {
        title: data.name,
        cover: data.src,
        imageId: data.id
      })
    }
    else if (data.type === 'ranking-item') {
      if (data.tier !== tier) {
        // 跨行移动 - 追加到末尾
        rankingStore.moveItem(data.tier, data.index, tier)
      }
      else if (dragOverIndex.value[tier] === -1) {
        // 同行内拖到行尾（不在任何项上）- 追加到末尾
        const lastIndex = rankingStore.rankings[tier].length - 1
        if (data.index !== lastIndex) {
          rankingStore.moveItem(data.tier, data.index, tier)
        }
      }
    }
  }
  catch (err) {
    console.error('Drop error:', err)
  }

  handleDragEnd()
}

// 滚轮滚动
function handleWheel(e: WheelEvent) {
  const target = e.currentTarget as HTMLElement
  if (e.deltaY !== 0) {
    e.preventDefault()
    target.scrollLeft += e.deltaY * 0.5
  }
}

// 上传
async function handleUpload(files: File[]) {
  for (const file of files) {
    await resourcesStore.addImage(file)
  }
}

// URL 添加
async function handleAddFromUrl(url: string) {
  await resourcesStore.addFromUrl(url)
}

// 删除图片请求
function handleDeleteImageRequest(id: string, name: string) {
  deleteDialog.value = {
    show: true,
    imageId: id,
    imageName: name
  }
}

// 确认删除
async function handleConfirmDelete() {
  await resourcesStore.removeImage(deleteDialog.value.imageId)
  rankingStore.removeByImageId(deleteDialog.value.imageId)
  deleteDialog.value.show = false
}

// 取消删除
function handleCancelDelete() {
  deleteDialog.value.show = false
}

// 清空所有图片
async function handleClearAll() {
  await resourcesStore.clearAll()
  rankingStore.clearAll()
}
</script>
