<style scoped>
.ranking-board {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
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
  <div class="ranking-board">
    <div class="ranking-content">
      <H2lRanking ref="h2lRankingRef" :rankings="rankingStore.rankings">
        <template v-for="tier in tiers" :key="tier" #[tier]>
          <RankingRow
            :tier="tier"
            :items="rankingStore.rankings[tier]"
            :dragged-item="draggedItem"
            :drag-over-index="dragOverIndex[tier]"
            :drag-over-tier="dragOverTier"
            @click="openViewer"
            @middle-click="handleMiddleClick"
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

    <TrashBin
      :show="!!draggedItem"
      :is-drag-over="dragOverTrash"
      @drag-over="handleDragOverTrash"
      @drag-leave="handleDragLeaveTrash"
      @drop="handleDropOnTrash"
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
import type { RankingItem, RankingTier } from '~/types'
import H2lRanking from 'h2l-ranking'
import { ref } from 'vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import RankingLinks from '~/components/RankingLinks.vue'
import RankingRow from '~/components/RankingRow.vue'
import TrashBin from '~/components/TrashBin.vue'
import { useDragDrop } from '~/composables/useDragDrop'
import { useRankingStore } from '~/stores/ranking'
import { useResourcesStore } from '~/stores/resources'
import 'h2l-ranking/style.css'

const rankingStore = useRankingStore()
const resourcesStore = useResourcesStore()
const h2lRankingRef = ref()

const tiers: RankingTier[] = ['hang', 'upper', 'middle', 'lower', 'la']

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

const deleteDialog = ref({
  show: false,
  imageId: '',
  imageName: ''
})

// 自动初始化
rankingStore.loadFromStorage()

function openViewer(item: RankingItem) {
  h2lRankingRef.value?.openViewer(item.cover, item.url, item.title, item.description)
}

function handleMiddleClick(tier: RankingTier, index: number) {
  // 只从排行榜中移除，不删除图片资源
  rankingStore.removeItem(tier, index)
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

defineExpose({
  handleUpload,
  handleAddFromUrl,
  handleDeleteImageRequest,
  handleClearAll
})
</script>
