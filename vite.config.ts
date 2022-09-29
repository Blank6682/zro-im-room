import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCss from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    Components({
      dirs: ['./src/components'],
    }),
    AutoImport({
      imports: ['vue', 'vue/macros', '@vueuse/core'], //使用vueuse则加上
      dirs: ['./src/utils'],
      vueTemplate: true,
    }),
    UnoCss({
      presets: [
        presetUno(),
        //预设属性Css
        presetAttributify(),
        //iconify
        presetIcons(),
      ],
      shortcuts: {
        'text-primary': 'text-#fe7734',
        'bg-primary': 'bg-#fe7734',
        'bg-input': 'bg-#f0f0f0',
        'bg-room': 'bg-#f5f5f5',
        'bg-chat': 'bg-#ffe5d9',
        'flex-center': ' flex justify-center items-center',
        'flex-col-center': ' flex flex-col justify-center items-center',
        'w-h-screen': 'w-screen h-screen',
        'w-h-full': 'w-full h-full',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
