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
</style>

<template>
  <div class="ranking-page">
    <div class="ranking-area" :style="{ marginRight: explorerVisible ? '280px' : '40px' }">
      <RankingBoard ref="rankingBoardRef" />
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RankingBoard from '~/components/RankingBoard.vue'
import ResourceExplorer from '~/components/ResourceExplorer.vue'
import { useResourcesStore } from '~/stores/resources'

const resourcesStore = useResourcesStore()
const rankingBoardRef = ref()
const explorerVisible = ref(true)

onMounted(async () => {
  await resourcesStore.loadAll()
})

function handleUpload(files: File[]) {
  rankingBoardRef.value?.handleUpload(files)
}

function handleAddFromUrl(url: string) {
  rankingBoardRef.value?.handleAddFromUrl(url)
}

function handleDeleteImageRequest(id: string, name: string) {
  rankingBoardRef.value?.handleDeleteImageRequest(id, name)
}

function handleClearAll() {
  rankingBoardRef.value?.handleClearAll()
}
</script>
