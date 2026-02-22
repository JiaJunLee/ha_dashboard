import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

console.log('✅ HA Dashboard 脚本已加载');

// 核心：确保 customPanel 全局可访问（防止作用域问题）
window.customPanel = window.customPanel || {};

// HA 面板初始化方法（增强容错 + 详细日志）
window.customPanel.init = async function(hass, element) {
    try {
        // 1. 打印关键参数，确认 HA 传递了正确的实例和元素
        console.log('🔍 开始初始化 Vue 面板');
        console.log('🔍 HA 实例:', hass ? '存在' : '不存在');
        console.log('🔍 挂载元素:', element);

        // 2. 保存 HA 实例到全局（Vue 组件内可直接使用 window.hass）
        window.hass = hass;

        // 3. 确保挂载元素存在（兼容 HA 不同版本的 iframe 模式）
        let mountElement = element;
        if (!mountElement) {
            console.log('⚠️ HA 未提供挂载元素，手动创建');
            mountElement = document.createElement('div');
            mountElement.id = 'ha-dashboard-root';
            // 给手动创建的元素添加样式，确保占满容器
            mountElement.style.width = '100%';
            mountElement.style.height = '100%';
            mountElement.style.margin = '0';
            mountElement.style.padding = '0';
            // 挂载到 body 或 iframe 的根节点
            const rootContainer = document.querySelector('iframe#custom-panel-frame')?.contentDocument?.body || document.body;
            rootContainer.appendChild(mountElement);
        } else {
            // 给 HA 提供的元素添加基础样式，防止 Vue 内容被隐藏
            mountElement.style.width = '100%';
            mountElement.style.height = '100%';
        }

        console.log('📌 最终挂载元素:', mountElement);

        // 4. 挂载 Vue 应用（关键：添加错误捕获）
        const vueApp = createApp(App);
        // 全局注册 HA 实例，Vue 组件内可通过 inject('hass') 获取（更优雅）
        vueApp.provide('hass', hass);
        // 挂载并捕获错误
        vueApp.mount(mountElement);

        console.log('🎉 Vue 面板挂载成功！');

    } catch (error) {
        // 捕获所有初始化错误，方便排查
        console.error('❌ Vue 面板初始化失败:', error);
        // 手动显示错误信息到页面，便于你直观看到问题
        const errorElement = document.createElement('div');
        errorElement.style.padding = '20px';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '16px';
        errorElement.innerHTML = `Vue 初始化失败：${error.message}<br>请查看浏览器控制台（F12）获取详细信息`;
        document.body.appendChild(errorElement);
    }
};

// 销毁方法（增强容错）
window.customPanel.destroy = function() {
    console.log('🔄 销毁 Vue 面板');
    const appElement = document.getElementById('ha-dashboard-root');
    if (appElement) {
        appElement.innerHTML = '';
        delete window.hass; // 清理全局变量
    }
};

// 开发环境兼容
if (process.env.NODE_ENV === 'development') {
    console.log('🔧 开发环境，直接挂载 Vue 到 #app');
    createApp(App).mount('#app');
}