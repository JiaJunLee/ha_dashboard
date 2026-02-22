import { createApp } from 'vue'
import './style.css'
import App from './App.vue'  // 你的 Vue 根组件

// HA 面板初始化方法（新版 HA 会调用这个方法）
window.customPanel = {
    async init(hass, element) {
        // 1. 保存 HA 实例到全局，供 Vue 组件使用
        window.hass = hass;

        // 2. 检查 element 是否存在，不存在则创建（适配 iframe 模式）
        let mountElement = element;
        if (!mountElement) {
            mountElement = document.createElement('div');
            mountElement.id = 'ha-dashboard';
            document.body.appendChild(mountElement);
        }

        // 3. 挂载 Vue 应用到 HA 提供的元素/手动创建的元素
        createApp(App).mount(mountElement);
    },
    destroy() {
        // 可选：销毁 Vue 应用（防止内存泄漏）
        const appElement = document.getElementById('ha-dashboard');
        if (appElement) appElement.innerHTML = '';
    }
};

// 开发环境兼容（不影响 HA 生产环境）
if (process.env.NODE_ENV === 'development') {
    createApp(App).mount('#app');
}