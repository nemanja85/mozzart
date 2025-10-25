import { QueryClient } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './app.css';

const app = createApp(App)

const queryClient = new QueryClient();

app.use(createPinia())
app.provide('queryClient', queryClient);
app.mount('#app')
