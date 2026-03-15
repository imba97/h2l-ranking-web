import { resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter(),
    Vue(),
    UnoCSS(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia'
      ],
      dts: '.auto-generated/auto-imports.d.ts',
      vueTemplate: true
    }),
    Components({
      dts: '.auto-generated/components.d.ts'
    })
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    }
  }
})
