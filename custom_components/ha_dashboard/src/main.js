import { createApp, h } from 'vue'
import wrap from '@vue/web-component-wrapper'
import App from './App.vue'
import './style.css'

console.log('✅ HA Dashboard 脚本已加载（适配 2025+）');

// 1. 封装 Vue 组件为 Web Component（HA 原生支持）
const HaDashboardPanel = wrap(createApp, h, App);

// 2. 注册自定义元素（新版 HA 核心：无需 init 方法，直接注册）
// 注意：元素名必须是「小写 + 横线」格式（Web Components 规范）
customElements.define('ha-dashboard-panel', HaDashboardPanel);

// 3. 给 Vue 组件传递 HA 实例（新版 HA 事件机制）
document.addEventListener('hass-element-init', (e) => {
    console.log('🔍 接收到 HA 初始化事件:', e.detail);
    // 将 HA 实例挂载到全局，Vue 组件内可直接使用
    window.hass = e.detail.hass;
    // 也可以通过组件实例传递（更优雅）
    const panelElement = document.querySelector('ha-dashboard-panel');
    if (panelElement) {
        panelElement.hass = e.detail.hass;
    }
});

// 开发环境兼容（本地调试用，不影响 HA 环境）
if (process.env.NODE_ENV === 'development') {
    // 模拟 HA 实例（本地调试时用）
    window.hass = {
        config: { version: '2025.11.3 (dev)' },
        states: { 'light.living_room': { state: 'on' } }
    };
    createApp(App).mount('#app');
}