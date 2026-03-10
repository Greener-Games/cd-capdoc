import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Tres from '@tresjs/core';
import router from './router';
import App from './App.vue';

// Vidstack Imports
import 'vidstack/bundle';

import './assets/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Tres);

app.mount('#root');
