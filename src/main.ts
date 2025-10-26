import { createApp } from '@vue/runtime-dom';
import { createPinia } from 'pinia';
import App from './App.vue';
import './app.css';

const app = createApp(App)

app.use(createPinia())
app.mount('#app')
