import type { RankingTier } from '~/types'
import { ref } from 'vue'

export function useDragDrop(rankingStore: ReturnType<typeof import('~/stores/ranking')['useRankingStore']>) {
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
  function handleDragOverTrash() {
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
  function handleDropOnTrash() {
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

    try {
      const data = JSON.parse(e.dataTransfer?.getData('application/json') || '{}')

      if (data.type === 'resource') {
        // 从资源管理器拖入 - 插入到指定位置
        rankingStore.insertItem(tier, {
          title: data.name,
          cover: data.src,
          imageId: data.id
        }, toIndex)
        handleDragEnd()
        return
      }
    }
    catch {
      // 忽略解析错误
    }

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

  return {
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
  }
}
