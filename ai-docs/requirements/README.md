# H2L Ranking Web - Requirements

## Project Overview

A web-based ranking application built on the `h2l-ranking` Vue component, allowing users to create "从夯到拉" (from best to worst) rankings with drag-and-drop image support.

## Tech Stack

- **Framework**: Vue 3 + Vite
- **Language**: TypeScript
- **Core Component**: [h2l-ranking](https://github.com/imba97/h2l-ranking)
- **Storage**: @zenfs/core (memory file system with IndexedDB persistence)
- **Drag & Drop**: [vue3-dnd](https://www.vue3-dnd.com/) + react-dnd-html5-backend
- **State Management**: Pinia
- **Package Manager**: pnpm

## Requirement Documents

- [Overview](./01-overview.md) - Project overview and architecture
- [Ranking Component Integration](./02-ranking-integration.md) - h2l-ranking component usage
- [Image Storage System](./03-image-storage.md) - memfs-based image persistence
- [Resource Explorer](./04-resource-explorer.md) - Right sidebar resource management
- [Drag & Drop](./05-drag-drop.md) - Drag and drop functionality

## Quick Links

- h2l-ranking source: `D:/Projects/h2l-ranking`
- Project root: `D:/Projects/h2l-ranking-web`
