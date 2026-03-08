# Ranking Component Integration

## 组件来源

使用 [h2l-ranking](https://github.com/imba97/h2l-ranking) Vue 3 组件。

## 安装

```bash
pnpm add h2l-ranking
```

## 基础用法

```vue
<template>
  <H2lRanking :rankings="rankings" />
</template>

<script setup lang="ts">
import H2lRanking from 'h2l-ranking'
import { ref } from 'vue'
import 'h2l-ranking/style.css'

const rankings = ref({
  hang: [],
  upper: [],
  middle: [],
  lower: [],
  la: []
})
</script>
```

## API

### Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|--------|------|
| rankings | `Rankings` | 是 | - | 排行数据 |
| enableImageViewer | `boolean` | 否 | `true` | 是否启用图片预览器 |

### Types

```typescript
interface RankingItem {
  title: string // 标题
  cover: string // 封面图片地址
  url?: string // 跳转链接（可选）
  description?: string // 描述（可选）
}

interface Rankings {
  hang: RankingItem[] // 夯 - 最强
  upper: RankingItem[] // 顶级
  middle: RankingItem[] // 人上人 - 中等
  lower: RankingItem[] // NPC
  la: RankingItem[] // 拉完了 - 最差
}
```

## 需要的二次开发

h2l-ranking 组件当前不支持拖拽功能，需要进行二次开发：

### 方案 1: Fork 修改

1. Fork h2l-ranking 仓库到本地
2. 添加拖拽功能（使用 dnd-kit 或类似库）
3. 发布为私有包或直接使用本地包

### 方案 2: 包装组件

1. 创建包装组件，监听拖拽事件
2. 通过 props 传递排序回调
3. 限制：可能需要修改源码才能实现真正的拖拽

### 方案 3: 提交 PR

向 h2l-ranking 提交 PR 添加拖拽功能（推荐）

## 拖拽功能需求

1. **从资源管理器拖到排行榜** - 将图片拖入指定档位
2. **排行榜内部排序** - 在同一档位内调整顺序
3. **跨档位拖拽** - 将图片从一个档位拖到另一个档位
4. **拖拽预览** - 拖拽时显示半透明预览
5. **放置指示器** - 显示放置位置的视觉反馈

## 组件位置

源码位置: `D:/Projects/h2l-ranking/src/components/H2lRanking.vue`

关键文件:
- `H2lRanking.vue` - 主组件
- `H2lTooltip.vue` - 提示组件
- `H2lImageViewer.vue` - 图片预览器
- `types.ts` - 类型定义
