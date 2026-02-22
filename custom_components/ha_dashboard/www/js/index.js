import"https://unpkg.com/wired-card@2.1.0/lib/wired-card.js?module";import{LitElement as c,html as a,css as l}from"https://unpkg.com/lit-element@2.4.0/lit-element.js?module";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();class p extends c{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},route:{type:Object},panel:{type:Object}}}render(){return a`
      <wired-card elevation="2">
        <p>There are ${Object.keys(this.hass.states).length} entities.</p>
        <p>The screen is${this.narrow?"":" not"} narrow.</p>
        Configured panel config
        <pre>${JSON.stringify(this.panel.config,void 0,2)}</pre>
        Current route
        <pre>${JSON.stringify(this.route,void 0,2)}</pre>
      </wired-card>
    `}static get styles(){return l`
      :host {
        background-color: #fafafa;
        padding: 16px;
        display: block;
      }
      wired-card {
        background-color: white;
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 600px;
        margin: 0 auto;
      }
    `}}customElements.define("example-panel",p);
