# Resource Explorer

## 依赖安装

```bash
pnpm add vue3-dnd react-dnd-html5-backend
```

## 位置

右侧边栏（可折叠）

## 功能

### 1. 图片来源

#### 1.1 上传图片

- 点击上传按钮
- 支持多选
- 文件类型过滤（jpg, png, gif, webp）
- 大小限制（10MB）

#### 1.2 选择目录

- 使用 `<input type="file" webkitdirectory>` 或 File System Access API
- 批量导入目录下所有图片

#### 1.3 输入 URL

- 输入框 + 确认按钮
- 支持 CORS 的图片 URL
- 自动下载并存储到 memfs

#### 1.4 粘贴图片

- 支持 Ctrl+V 粘贴剪贴板图片

### 2. 图片列表展示

```vue
<div class="resource-explorer">
  <!-- 来源选择 -->
  <div class="resource-source">
    <button>Upload</button>
    <button>Select Folder</button>
    <input type="text" placeholder="Paste image URL..." />
  </div>

  <!-- 图片网格 -->
  <div class="resource-grid">
    <div v-for="img in images" :key="img.id" class="resource-item" draggable="true">
      <img :src="img.src" />
      <div class="resource-overlay">
        <span class="resource-name">{{ img.name }}</span>
        <button @click="deleteImage(img.id)">×</button>
      </div>
    </div>
  </div>

  <!-- 统计信息 -->
  <div class="resource-stats">
    {{ images.length }} images · {{ totalSize }} MB
  </div>
</div>
```

### 3. 拖拽支持

每个图片项设置 `draggable="true"`，提供拖拽数据：

```typescript
function handleDragStart(event: DragEvent, image: ImageResource) {
  event.dataTransfer?.setData('application/json', JSON.stringify({
    type: 'image',
    id: image.id,
    src: image.src,
    name: image.name
  }))
  event.dataTransfer?.effectAllowed = 'copy'
}
```

### 4. 状态管理

使用 Pinia 管理图片资源状态：

```typescript
// stores/resources.ts
interface ResourcesState {
  images: ImageResource[]
  isLoading: boolean
  error: string | null
  filter: string // 搜索过滤
  sortBy: 'name' | 'date' | 'size'
}

interface ResourcesActions {
  addImage: (file: File) => Promise<void>
  addFromUrl: (url: string) => Promise<void>
  removeImage: (id: string) => Promise<void>
  loadAll: () => Promise<void>
  setFilter: (query: string) => void
  setSortBy: (sort: string) => void
}

export const useResourcesStore = defineStore('resources', {
  state: (): ResourcesState => ({
    images: [],
    isLoading: false,
    error: null,
    filter: '',
    sortBy: 'date'
  }),

  actions: {
    async addImage(file: File) {},
    async addFromUrl(url: string) {},
    async removeImage(id: string) {},
    async loadAll() {},
    setFilter(query: string) {},
    setSortBy(sort: string) {}
  }
})
```

### 5. UI 样式

```css
.resource-explorer {
  width: 300px;
  background: #2a2a2a;
  border-left: 1px solid #000;
  display: flex;
  flex-direction: column;
}

.resource-source {
  padding: 12px;
  border-bottom: 1px solid #333;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resource-grid {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.resource-item {
  aspect-ratio: 1;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
  cursor: grab;
  position: relative;
}

.resource-item:hover .resource-overlay {
  opacity: 1;
}

.resource-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px;
}

.resource-stats {
  padding: 8px 12px;
  border-top: 1px solid #333;
  font-size: 12px;
  color: #888;
  text-align: center;
}
```

### 6. 隐藏/折叠

支持收起资源管理器以获得更多排行榜空间：

```vue
<button @click="toggleExplorer" class="toggle-btn">
  {{ explorerVisible ? '»' : '«' }}
</button>
```

## 功能优先级

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 上传图片 | P0 | 核心功能 |
| 图片列表展示 | P0 | 核心功能 |
| 拖拽支持 | P0 | 核心功能 |
| 删除图片 | P1 | 基础功能 |
| URL 导入 | P1 | 常用功能 |
| 目录导入 | P2 | 批量操作 |
| 粘贴图片 | P2 | 便捷功能 |
| 搜索过滤 | P2 | 增强体验 |
| 排序 | P3 | 辅助功能 |
