import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/local/community/ha_dashboard/custom_components/ha_dashboard/www' : '',
  plugins: [vue()],
  // 关键：打包输出适配 HA 的目录和格式
  build: {
    // 输出目录改为 HA 易识别的 dist
    outDir: 'www',
    // 打包为静态资源（无 hash，方便 HA 引用）
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: '[ext]/[name].[ext]',
        // 确保 CSS 被内联到 JS 中
        manualChunks: undefined,
      },
      // 确保 CSS 被内联到 JS 中
      plugins: [
        {
          name: 'inline-css',
          generateBundle(outputOptions, bundle) {
            // 遍历所有资源
            for (const key in bundle) {
              if (bundle[key].type === 'asset' && bundle[key].fileName.endsWith('.css')) {
                // 删除 CSS 资源，因为我们会内联它
                delete bundle[key];
              }
            }
          }
        }
      ]
    },
    // 禁用 sourcemap（减少体积，HA 生产环境不需要）
    sourcemap: false,
    // 确保 CSS 被内联到 JS 中
    cssCodeSplit: false,
  },
  // 配置路径别名（可选，方便开发）
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 开发时允许 HA 跨域访问（调试用）
  server: {
    cors: true,
    host: '0.0.0.0', // 允许局域网访问
  },
})