<style scoped>
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
</style>

<template>
  <div
    class="h2l-ranking__items"
    :class="{ 'is-drag-over': isDragOver }"
    @dragover="handleDragOverRowContainer"
    @dragleave="handleDragLeaveRow"
    @drop="handleDropRow"
    @wheel="handleWheel"
  >
    <div
      v-for="(item, index) in items"
      :key="`${tier}-${index}`"
      class="h2l-ranking__item"
      :class="itemClasses(index)"
      draggable="true"
      :title="item.title"
      @click="emit('click', item)"
      @dragstart="emit('dragStart', tier, index, $event)"
      @dragend="emit('dragEnd')"
      @dragover="handleDragOverItem(index, $event)"
      @drop="handleDropOnItem(index, $event)"
    >
      <img :src="item.cover" :alt="item.title">
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RankingItem, RankingTier } from '~/types'

const props = defineProps<{
  tier: RankingTier
  items: RankingItem[]
  draggedItem?: { tier: RankingTier, index: number } | null
  dragOverIndex: number
  dragOverTier?: RankingTier | null
}>()

const emit = defineEmits<{
  (e: 'click', item: RankingItem): void
  (e: 'dragStart', tier: RankingTier, index: number, e: DragEvent): void
  (e: 'dragEnd'): void
  (e: 'dragOverItem', tier: RankingTier, index: number, e: DragEvent): void
  (e: 'dropOnItem', tier: RankingTier, index: number, e: DragEvent): void
  (e: 'dragOverRowContainer', tier: RankingTier, e: DragEvent): void
  (e: 'dragLeaveRow', tier: RankingTier, e: DragEvent): void
  (e: 'dropRow', tier: RankingTier, e: DragEvent): void
  (e: 'wheel', e: WheelEvent): void
}>()

function itemClasses(index: number) {
  return {
    'is-dragging': props.draggedItem?.tier === props.tier && props.draggedItem.index === index,
    'is-drop-before': props.dragOverIndex === index
  }
}

const isDragOver = computed(() => props.dragOverTier === props.tier)

function handleDragOverItem(index: number, e: DragEvent) {
  emit('dragOverItem', props.tier, index, e)
}

function handleDropOnItem(index: number, e: DragEvent) {
  emit('dropOnItem', props.tier, index, e)
}

function handleDragOverRowContainer(e: DragEvent) {
  emit('dragOverRowContainer', props.tier, e)
}

function handleDragLeaveRow(e: DragEvent) {
  emit('dragLeaveRow', props.tier, e)
}

function handleDropRow(e: DragEvent) {
  emit('dropRow', props.tier, e)
}

function handleWheel(e: WheelEvent) {
  emit('wheel', e)
}
</script>
