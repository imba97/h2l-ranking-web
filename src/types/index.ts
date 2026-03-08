export interface RankingItem {
  title: string
  cover: string
  imageId?: string // 存储图片 ID，用于从 IndexedDB 恢复 blob URL
  url?: string
  description?: string
}

export interface Rankings {
  hang: RankingItem[]
  upper: RankingItem[]
  middle: RankingItem[]
  lower: RankingItem[]
  la: RankingItem[]
}

export type RankingTier = keyof Rankings

export interface ImageResource {
  id: string
  name: string
  src: string
  type: 'blob' | 'memfs' | 'url'
  url?: string
  createdAt: number
  size: number
  mimeType: string
}

export interface StoredImage {
  id: string
  name: string
  mimeType: string
  data: ArrayBuffer
  createdAt: number
  size: number
}

export const RANKING_TIERS: { key: RankingTier, label: string, color: string }[] = [
  { key: 'hang', label: '夯', color: '#ff0000' },
  { key: 'upper', label: '顶级', color: '#ff9500' },
  { key: 'middle', label: '人上人', color: '#ffcc00' },
  { key: 'lower', label: 'NPC', color: '#fef4d1' },
  { key: 'la', label: '拉完了', color: '#ffffff' }
]
