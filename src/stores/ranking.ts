import type { RankingItem, Rankings, RankingTier } from '~/types'
import { imageStorageService } from '~/services/imageStorage'

export const useRankingStore = defineStore('ranking', () => {
  const rankings = reactive<Rankings>({
    hang: [],
    upper: [],
    middle: [],
    lower: [],
    la: []
  })

  const addItem = (tier: RankingTier, item: RankingItem) => {
    rankings[tier].push(item)
  }

  const insertItem = (tier: RankingTier, item: RankingItem, index: number) => {
    rankings[tier].splice(index, 0, item)
  }

  const removeItem = (tier: RankingTier, index: number) => {
    rankings[tier].splice(index, 1)
  }

  // 按 imageId 删除所有引用
  const removeByImageId = (imageId: string) => {
    const tiers: RankingTier[] = ['hang', 'upper', 'middle', 'lower', 'la']
    for (const tier of tiers) {
      rankings[tier] = rankings[tier].filter(item => item.imageId !== imageId)
    }
  }

  const updateItem = (tier: RankingTier, index: number, item: Partial<RankingItem>) => {
    const existing = rankings[tier][index]
    if (!existing)
      return
    rankings[tier][index] = {
      title: item.title ?? existing.title,
      cover: item.cover ?? existing.cover,
      imageId: item.imageId ?? existing.imageId,
      url: item.url ?? existing.url,
      description: item.description ?? existing.description
    }
  }

  const reorderItem = (tier: RankingTier, fromIndex: number, toIndex: number) => {
    const items = [...rankings[tier]]
    const [removed] = items.splice(fromIndex, 1)
    if (!removed)
      return
    items.splice(toIndex, 0, removed)
    rankings[tier] = items
  }

  const moveItem = (
    fromTier: RankingTier,
    fromIndex: number,
    toTier: RankingTier,
    toIndex?: number
  ) => {
    const item = rankings[fromTier][fromIndex]
    if (!item)
      return
    rankings[fromTier].splice(fromIndex, 1)
    if (toIndex !== undefined) {
      rankings[toTier].splice(toIndex, 0, item)
    }
    else {
      rankings[toTier].push(item)
    }
  }

  const clearTier = (tier: RankingTier) => {
    rankings[tier] = []
  }

  const clearAll = () => {
    rankings.hang = []
    rankings.upper = []
    rankings.middle = []
    rankings.lower = []
    rankings.la = []
  }

  const loadFromStorage = async () => {
    const saved = localStorage.getItem('h2l-rankings')
    if (saved) {
      try {
        const data = JSON.parse(saved) as Rankings

        // 恢复 blob URL
        const restoreCoverUrl = async (item: RankingItem): Promise<RankingItem> => {
          if (item.imageId) {
            const url = await imageStorageService.getImageUrl(item.imageId)
            return { ...item, cover: url || item.cover }
          }
          return item
        }

        rankings.hang = await Promise.all((data.hang || []).map(restoreCoverUrl))
        rankings.upper = await Promise.all((data.upper || []).map(restoreCoverUrl))
        rankings.middle = await Promise.all((data.middle || []).map(restoreCoverUrl))
        rankings.lower = await Promise.all((data.lower || []).map(restoreCoverUrl))
        rankings.la = await Promise.all((data.la || []).map(restoreCoverUrl))
      }
      catch (e) {
        console.error('Failed to load rankings:', e)
      }
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('h2l-rankings', JSON.stringify(rankings))
  }

  watch(
    rankings,
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  return {
    rankings,
    addItem,
    insertItem,
    removeItem,
    updateItem,
    reorderItem,
    moveItem,
    clearTier,
    clearAll,
    loadFromStorage,
    removeByImageId
  }
})
