import { createApp, h } from 'vue'
import wrap from '@vue/web-component-wrapper'
import App from './App.vue'
import './style.css'

console.log('✅ HA Dashboard 脚本已加载（适配 2025.11.3）');

// 1. 封装 Vue 组件为 Web Component
const HaDashboardPanel = wrap(createApp, h, App);

// 2. 注册自定义元素（Web Components 规范）
customElements.define('ha-dashboard-panel', HaDashboardPanel);

// 3. 核心：适配 HA 2025+ 自动挂载逻辑
async function initHaDashboard() {
    try {
        // 等待 HA 面板容器加载完成（最多等 3 秒，避免加载时机问题）
        let panelContainer = null;
        let retryCount = 0;
        while (!panelContainer && retryCount < 30) {
            // HA 2025 自定义面板的容器特征：id 包含 "panel" 或 class 包含 "view-content"
            panelContainer = document.querySelector('.view-content') ||
                document.getElementById('custom-panel-container') ||
                document.querySelector('main > div');
            if (!panelContainer) await new Promise(resolve => setTimeout(resolve, 100));
            retryCount++;
        }

        if (!panelContainer) {
            throw new Error('未找到 HA 面板容器');
        }

        console.log('🔍 找到 HA 面板容器:', panelContainer);

        // 4. 创建自定义元素并挂载到容器
        const dashboardElement = document.createElement('ha-dashboard-panel');
        panelContainer.innerHTML = ''; // 清空容器原有内容
        panelContainer.appendChild(dashboardElement);

        // 5. 绑定 HA 实例（适配 2025+ 多事件触发方式）
        const bindHassInstance = (hass) => {
            window.hass = hass;
            dashboardElement.hass = hass;
            console.log('🎉 成功绑定 HA 实例:', hass.config.version);
        };

        // 监听 HA 实例就绪事件（2025+ 主流方式）
        if (window.hass) {
            // 若 HA 实例已存在，直接绑定
            bindHassInstance(window.hass);
        } else {
            // 监听 HA 初始化事件（兜底）
            document.addEventListener('hass-ready', (e) => bindHassInstance(e.detail.hass));
            document.addEventListener('hass-element-init', (e) => bindHassInstance(e.detail.hass));
        }

    } catch (error) {
        console.error('❌ HA Dashboard 初始化失败:', error);
        // 页面显示错误信息，便于排查
        const errorEl = document.createElement('div');
        errorEl.style = 'padding:20px;color:red;font-size:16px;';
        errorEl.innerHTML = `初始化失败：${error.message}<br>请检查 JS 路径和容器是否存在`;
        document.body.appendChild(errorEl);
    }
}

// 页面加载完成后立即初始化（HA 2025+ 触发时机）
if (document.readyState === 'complete') {
    initHaDashboard();
} else {
    window.addEventListener('load', initHaDashboard);
}

// 开发环境兼容
if (process.env.NODE_ENV === 'development') {
    window.hass = { config: { version: '2025.11.3 (dev)' }, states: { 'light.living_room': { state: 'on' } } };
    createApp(App).mount('#app');
}