<style scoped>
.ranking-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  font-size: 13px;
  color: #666;
}

.ranking-links a {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.ranking-links a:hover {
  color: #3b82f6;
}

.ranking-links__dot {
  color: #444;
}
</style>

<template>
  <div class="ranking-links">
    <a href="https://github.com/imba97/h2l-ranking-web" target="_blank" rel="noopener">
      <span class="i-mdi-github" />
      Github
    </a>
    <span class="ranking-links__dot">·</span>
    <a href="https://github.com/imba97/h2l-ranking" target="_blank" rel="noopener">
      <span class="i-mingcute-plugin-2-fill" />
      组件
    </a>
  </div>
</template>
