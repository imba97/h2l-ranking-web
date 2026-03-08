# Project Overview

## 目标

基于 `h2l-ranking` 组件构建一个从夯到拉排行榜 Web 应用，支持用户上传图片、拖拽排序，并提供友好的图片资源管理界面。

## 核心功能

1. **排行榜展示** - 使用 h2l-ranking 组件展示五档排名
2. **图片上传与存储** - 支持图片上传，使用 memfs 确保刷新后持久化
3. **资源管理器** - 右侧面板管理图片资源
4. **拖拽排序** - 支持拖拽图片到排行榜各档位

## UI 布局

```
+--------------------------+------------------+
|                          |                  |
|                          |   Resource       |
|      Ranking Area        |   Explorer       |
|      (h2l-ranking)       |                  |
|                          |   - Upload       |
|                          |   - Select File  |
|                          |   - Select Dir   |
|                          |   - Input URL    |
+--------------------------+------------------+
```

## 五档排名

| 档位 | 名称 | 颜色 | 含义 |
|------|------|------|------|
| hang | 夯 | 红色 #ff0000 | 最强 |
| upper | 顶级 | 橙色 #ff9500 | 优秀 |
| middle | 人上人 | 黄色 #ffcc00 | 中等 |
| lower | NPC | 米色 #fef4d1 | 较差 |
| la | 拉完了 | 白色 #ffffff | 最差 |

## Data Model

```typescript
interface RankingItem {
  title: string // 标题
  cover: string // 封面图片地址 (blob: 或 memfs: 路径)
  url?: string // 跳转链接（可选）
  description?: string // 描述（可选）
}

interface Rankings {
  hang: RankingItem[] // 夯
  upper: RankingItem[] // 顶级
  middle: RankingItem[] // 人上人
  lower: RankingItem[] // NPC
  la: RankingItem[] // 拉完了
}

interface ImageResource {
  id: string // 唯一标识
  name: string // 文件名
  src: string // blob URL 或 memfs 路径
  type: 'blob' | 'memfs' | 'url'
  url?: string // 原始 URL（如果是网络图片）
  createdAt: number // 创建时间戳
}
```

## Open Questions

1. **memfs 持久化方案** - memfs 默认是内存存储，需要配合 IndexedDB 或 localStorage 实现持久化
2. **图片大小限制** - 需要设定单张图片和总存储空间的限制
3. **导出功能** - 是否需要支持导出/导入排行榜数据
4. **分享功能** - 是否需要生成分享链接
