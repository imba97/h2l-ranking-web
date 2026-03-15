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

.h2l-ranking {
  width: 100%;
  max-height: 100%;
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
</style>

<template>
  <div class="ranking-page">
    <div class="ranking-area" :style="{ marginRight: explorerVisible ? '280px' : '40px' }">
      <div class="ranking-content">
        <H2lRanking ref="h2lRankingRef" :rankings="rankingStore.rankings">
          <template #hang>
            <RankingRow
              tier="hang"
              :items="rankingStore.rankings.hang"
              :dragged-item="draggedItem"
              :drag-over-index="dragOverIndex.hang"
              :drag-over-tier="dragOverTier"
              @click="openViewer"
              @drag-start="handleDragStart"
              @drag-end="handleDragEnd"
              @drag-over-item="handleDragOverItem"
              @drop-on-item="handleDropOnItem"
              @drag-over-row-container="handleDragOverRowContainer"
              @drag-leave-row="handleDragLeaveRow"
              @drop-row="handleDrop"
              @wheel="handleWheel"
            />
          </template>

          <template #upper>
            <RankingRow
              tier="upper"
              :items="rankingStore.rankings.upper"
              :dragged-item="draggedItem"
              :drag-over-index="dragOverIndex.upper"
              :drag-over-tier="dragOverTier"
              @click="openViewer"
              @drag-start="handleDragStart"
              @drag-end="handleDragEnd"
              @drag-over-item="handleDragOverItem"
              @drop-on-item="handleDropOnItem"
              @drag-over-row-container="handleDragOverRowContainer"
              @drag-leave-row="handleDragLeaveRow"
              @drop-row="handleDrop"
              @wheel="handleWheel"
            />
          </template>

          <template #middle>
            <RankingRow
              tier="middle"
              :items="rankingStore.rankings.middle"
              :dragged-item="draggedItem"
              :drag-over-index="dragOverIndex.middle"
              :drag-over-tier="dragOverTier"
              @click="openViewer"
              @drag-start="handleDragStart"
              @drag-end="handleDragEnd"
              @drag-over-item="handleDragOverItem"
              @drop-on-item="handleDropOnItem"
              @drag-over-row-container="handleDragOverRowContainer"
              @drag-leave-row="handleDragLeaveRow"
              @drop-row="handleDrop"
              @wheel="handleWheel"
            />
          </template>

          <template #lower>
            <RankingRow
              tier="lower"
              :items="rankingStore.rankings.lower"
              :dragged-item="draggedItem"
              :drag-over-index="dragOverIndex.lower"
              :drag-over-tier="dragOverTier"
              @click="openViewer"
              @drag-start="handleDragStart"
              @drag-end="handleDragEnd"
              @drag-over-item="handleDragOverItem"
              @drop-on-item="handleDropOnItem"
              @drag-over-row-container="handleDragOverRowContainer"
              @drag-leave-row="handleDragLeaveRow"
              @drop-row="handleDrop"
              @wheel="handleWheel"
            />
          </template>

          <template #la>
            <RankingRow
              tier="la"
              :items="rankingStore.rankings.la"
              :dragged-item="draggedItem"
              :drag-over-index="dragOverIndex.la"
              :drag-over-tier="dragOverTier"
              @click="openViewer"
              @drag-start="handleDragStart"
              @drag-end="handleDragEnd"
              @drag-over-item="handleDragOverItem"
              @drop-on-item="handleDropOnItem"
              @drag-over-row-container="handleDragOverRowContainer"
              @drag-leave-row="handleDragLeaveRow"
              @drop-row="handleDrop"
              @wheel="handleWheel"
            />
          </template>
        </H2lRanking>

        <RankingLinks />
      </div>
    </div>

    <TrashBin
      :show="!!draggedItem"
      :is-drag-over="dragOverTrash"
      @drag-over="handleDragOverTrash"
      @drag-leave="handleDragLeaveTrash"
      @drop="handleDropOnTrash"
    />

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
import type { RankingItem } from '~/types'
import H2lRanking from 'h2l-ranking'
import { onMounted, ref } from 'vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import RankingLinks from '~/components/RankingLinks.vue'
import RankingRow from '~/components/RankingRow.vue'
import ResourceExplorer from '~/components/ResourceExplorer.vue'
import TrashBin from '~/components/TrashBin.vue'
import { useDragDrop } from '~/composables/useDragDrop'
import { useRankingStore } from '~/stores/ranking'
import { useResourcesStore } from '~/stores/resources'
import 'h2l-ranking/style.css'

const rankingStore = useRankingStore()
const resourcesStore = useResourcesStore()
const h2lRankingRef = ref()
const {
  dragOverTier,
  draggedItem,
  dragOverTrash,
  dragOverIndex,
  handleDragStart,
  handleDragEnd,
  handleDragOverTrash,
  handleDragLeaveTrash,
  handleDropOnTrash,
  handleDragLeaveRow,
  handleDragOverItem,
  handleDragOverRowContainer,
  handleDropOnItem,
  handleDrop,
  handleWheel
} = useDragDrop(rankingStore)

const explorerVisible = ref(true)

const deleteDialog = ref({
  show: false,
  imageId: '',
  imageName: ''
})

onMounted(async () => {
  await rankingStore.loadFromStorage()
  await resourcesStore.loadAll()
})

function openViewer(item: RankingItem) {
  h2lRankingRef.value?.openViewer(item.cover, item.url, item.title, item.description)
}

async function handleUpload(files: File[]) {
  for (const file of files) {
    await resourcesStore.addImage(file)
  }
}

async function handleAddFromUrl(url: string) {
  await resourcesStore.addFromUrl(url)
}

function handleDeleteImageRequest(id: string, name: string) {
  deleteDialog.value = {
    show: true,
    imageId: id,
    imageName: name
  }
}

async function handleConfirmDelete() {
  await resourcesStore.removeImage(deleteDialog.value.imageId)
  rankingStore.removeByImageId(deleteDialog.value.imageId)
  deleteDialog.value.show = false
}

function handleCancelDelete() {
  deleteDialog.value.show = false
}

async function handleClearAll() {
  await resourcesStore.clearAll()
  rankingStore.clearAll()
}
</script>
