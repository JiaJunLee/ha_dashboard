import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue({
      template: {
        // 告诉 Vue 忽略自定义元素（避免打包警告）
        compilerOptions: { isCustomElement: (tag) => tag === 'ha-dashboard-panel' }
      }
    }),
    vueJsx()
  ],
  build: {
    outDir: 'www',
    // 关键：打包为单个 ES 模块文件，HA 2025+ 优先加载 ES 模块
    rollupOptions: {
      input: 'src/main.js',
      output: {
        format: 'es', // 输出 ES 模块（新版 HA 要求）
        entryFileNames: 'ha-dashboard-panel.js', // 单文件输出，便于 HA 加载
        compact: true // 压缩代码
      }
    },
    sourcemap: false
  }
})