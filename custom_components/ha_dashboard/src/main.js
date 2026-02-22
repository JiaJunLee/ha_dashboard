import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

customElements.define('ha-dashboard', class extends HTMLElement {
    set hass(hass) {
        if (!this._panel) {
            this._panel = createApp(App).mount(this);
        }
        this._panel.$hass = hass;
    }
});

// 开发环境兼容（不影响 HA 生产环境）
if (process.env.NODE_ENV === 'development') {
    createApp(App).mount('#app');
}