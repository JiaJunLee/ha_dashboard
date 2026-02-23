import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 定义自定义元素
class HaDashboard extends HTMLElement {
    constructor() {
        super();
        this._panel = null;
    }
    
    set hass(hass) {
        console.log('Received hass object:', !!hass);
        if (!this._panel) {
            console.log('Creating Vue app...');
            this._panel = createApp(App).mount(this);
            console.log('Vue app created:', !!this._panel);
        }
        console.log('Setting $hass property...');
        this._panel.$hass = hass;
        console.log('$hass property set:', !!this._panel.$hass);
    }
}

// 注册自定义元素
console.log('Registering custom element...');
customElements.define('ha-dashboard', HaDashboard);
console.log('Custom element registered');

// 开发环境兼容（不影响 HA 生产环境）
if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode');
    const app = createApp(App).mount('#app');
    // 模拟hass对象用于开发测试
    app.$hass = {
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
    console.log('Mock $hass set for development');
}