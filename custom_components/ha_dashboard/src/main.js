import { createApp, h } from 'vue'
import wrap from '@vue/web-component-wrapper'
import App from './App.vue'
import './style.css'

console.log('✅ HA Dashboard 脚本已加载（适配 2025.11.3）');

// 1. 封装 Vue 组件为 Web Component
const HaDashboardPanel = wrap(createApp, h, App);
customElements.define('ha-dashboard-panel', HaDashboardPanel);

// 2. 核心：适配 HA 2025+ 容器查找逻辑（精准定位）
async function initHaDashboard() {
    try {
        // 配置：你的面板 url_path（和 configuration.yaml 中的一致）
        const PANEL_URL_PATH = 'ha-dashboard';
        let panelContainer = null;
        let retryCount = 0;

        // 循环查找容器（最多等 5 秒，适配 2025 版加载时机）
        while (!panelContainer && retryCount < 50) {
            // HA 2025 自定义面板的核心容器（优先级从高到低）
            const containerSelectors = [
                // 1. 2025 版 iframe 容器（最核心）
                `iframe#custom-panel-${PANEL_URL_PATH}`,
                // 2. 面板根容器（无 iframe 模式）
                `div[route-path="/${PANEL_URL_PATH}"]`,
                // 3. 全局面板容器（兜底）
                'body > ha-app-layout > ha-main-layout > div > main',
                // 4. 最终兜底（页面根容器）
                'body'
            ];

            // 遍历选择器，找到第一个存在的容器
            for (const selector of containerSelectors) {
                panelContainer = document.querySelector(selector);
                if (panelContainer) break;
            }

            // 未找到则等待 100ms 重试
            if (!panelContainer) await new Promise(resolve => setTimeout(resolve, 100));
            retryCount++;
        }

        // 仍未找到：手动创建根容器
        if (!panelContainer) {
            console.log('⚠️ 未找到自动容器，手动创建根容器');
            panelContainer = document.createElement('div');
            panelContainer.id = 'ha-2025-dashboard-root';
            panelContainer.style.width = '100vw';
            panelContainer.style.height = '100vh';
            panelContainer.style.margin = '0';
            panelContainer.style.padding = '0';
            document.body.appendChild(panelContainer);
        }

        console.log('🔍 找到/创建 HA 面板容器:', panelContainer, '选择器:', panelContainer.id || panelContainer.tagName);

        // 3. 处理 iframe 容器（2025 版核心适配）
        let finalContainer = panelContainer;
        if (panelContainer.tagName === 'IFRAME') {
            // 等待 iframe 加载完成，获取其内部 document
            await new Promise((resolve) => {
                if (panelContainer.contentDocument.readyState === 'complete') {
                    resolve();
                } else {
                    panelContainer.onload = resolve;
                }
            });
            // iframe 内部的 body 作为最终挂载容器
            finalContainer = panelContainer.contentDocument.body;
        }

        // 4. 创建并挂载自定义元素
        const dashboardElement = document.createElement('ha-dashboard-panel');
        finalContainer.innerHTML = ''; // 清空原有内容
        finalContainer.appendChild(dashboardElement);

        // 5. 绑定 HA 实例（适配 2025+ 多场景）
        const bindHassInstance = (hass) => {
            if (!hass) return;
            window.hass = hass;
            dashboardElement.hass = hass;
            console.log('🎉 成功绑定 HA 实例:', hass.config.version);
        };

        // 优先从 window.hass 获取（2025 版全局暴露）
        if (window.hass) {
            bindHassInstance(window.hass);
        } else {
            // 监听所有 HA 实例就绪事件（兜底）
            document.addEventListener('hass-ready', (e) => bindHassInstance(e.detail.hass));
            document.addEventListener('hass-element-init', (e) => bindHassInstance(e.detail.hass));
            document.addEventListener('ha-ready', (e) => bindHassInstance(window.hass));
        }

    } catch (error) {
        console.error('❌ HA Dashboard 初始化失败:', error);
        // 页面显示错误信息，便于排查
        const errorEl = document.createElement('div');
        errorEl.style = 'position:fixed;top:20px;left:20px;padding:20px;background:#fff;color:red;font-size:16px;border:1px solid red;z-index:9999;';
        errorEl.innerHTML = `
      <h3>初始化失败</h3>
      <p>错误原因：${error.message}</p>
      <p>重试次数：${retryCount}/50</p>
      <p>请检查：</p>
      <ul>
        <li>configuration.yaml 中 url_path 是否为 ha-dashboard</li>
        <li>HA 是否重启完成</li>
        <li>浏览器控制台（F12）查看更多日志</li>
      </ul>
    `;
        document.body.appendChild(errorEl);
    }
}

// 页面加载完成后初始化（适配 2025 版加载时机）
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initHaDashboard();
} else {
    window.addEventListener('DOMContentLoaded', initHaDashboard);
    // 兜底：500ms 后强制初始化（防止 DOM 加载事件未触发）
    setTimeout(initHaDashboard, 500);
}

// 开发环境兼容
if (process.env.NODE_ENV === 'development') {
    window.hass = { config: { version: '2025.11.3 (dev)' }, states: { 'light.living_room': { state: 'on' } } };
    createApp(App).mount('#app');
}