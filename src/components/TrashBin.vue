<style scoped>
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
  <div
    v-if="show"
    class="trash-bin"
    :class="{ 'is-drag-over': isDragOver }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  isDragOver: boolean
}>()

const emit = defineEmits<{
  (e: 'dragOver', e: DragEvent): void
  (e: 'dragLeave', e: DragEvent): void
  (e: 'drop', e: DragEvent): void
}>()

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  emit('dragOver', e)
}

function handleDragLeave(e: DragEvent) {
  const relatedTarget = e.relatedTarget as HTMLElement
  const currentTarget = e.currentTarget as HTMLElement
  if (!currentTarget.contains(relatedTarget)) {
    emit('dragLeave', e)
  }
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  emit('drop', e)
}
</script>
