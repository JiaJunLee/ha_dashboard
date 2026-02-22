import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 方式 1：开发环境直接挂载
if (process.env.NODE_ENV === 'development') {
    createApp(App).mount('#app')
}

// 方式 2：HA 环境中暴露组件（供 HA 加载）
window.customPanel = {
    // HA 要求的初始化方法
    async init(hass, element) {
        // 在 HA 提供的元素中挂载 Vue 应用
        createApp(App).mount(element)
        // 保存 HA 实例到全局，供组件内使用
        window.hass = hass
    },
    // HA 要求的销毁方法
    destroy() {
        // 清理逻辑（可选）
    },
}