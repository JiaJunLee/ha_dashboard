import { createApp, provide } from 'vue'
import App from './App.vue'

// 定义自定义元素
class HaDashboard extends HTMLElement {
    constructor() {
        super();
        this._app = null;
        this._hass = null;
    }
    
    connectedCallback() {
        console.log('Custom element connected');
        // 动态加载CSS文件
        this.loadCSS();
    }
    
    loadCSS() {
        console.log('Loading CSS...');
        const cssPath = '/local/community/ha_dashboard/custom_components/ha_dashboard/www/css/index.css';
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath;
        link.onload = () => {
            console.log('CSS loaded successfully');
        };
        link.onerror = () => {
            console.error('Failed to load CSS:', cssPath);
        };
        document.head.appendChild(link);
    }
    
    set hass(hass) {
        console.log('Received hass object:', !!hass);
        this._hass = hass;
        
        if (!this._app) {
            console.log('Creating Vue app...');
            // 创建Vue应用并provide hass对象
            this._app = createApp(App);
            this._app.provide('hass', hass);
            this._app.mount(this);
            console.log('Vue app created:', !!this._app);
        } else {
            console.log('Updating hass object...');
            // 直接更新组件的hass属性
            const vm = this.querySelector('[data-v-app]');
            if (vm && vm.__vue_app__) {
                // 触发组件的hass更新
                vm.__vue_app__._instance.proxy.hass = hass;
                console.log('Hass updated via proxy');
            }
        }
        console.log('Hass processing complete');
    }
}

// 注册自定义元素
console.log('Registering custom element...');
customElements.define('ha-dashboard', HaDashboard);
console.log('Custom element registered');

// 开发环境兼容（不影响 HA 生产环境）
if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode');
    // 模拟hass对象用于开发测试
    const mockHass = {
        states: {
            'light.living_room': {
                entity_id: 'light.living_room',
                state: 'on',
                attributes: {
                    friendly_name: '客厅灯'
                },
                last_updated: new Date().toISOString()
            },
            'switch.kitchen': {
                entity_id: 'switch.kitchen',
                state: 'off',
                attributes: {
                    friendly_name: '厨房开关'
                },
                last_updated: new Date().toISOString()
            }
        }
    };
    
    const app = createApp(App);
    app.provide('hass', mockHass);
    app.mount('#app');
    console.log('Mock $hass provided for development');
}