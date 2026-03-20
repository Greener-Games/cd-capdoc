import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Tres from '@tresjs/core';
import router from './router';
import App from './App.vue';
import revealDirective from './directives/reveal';

// Vidstack Imports
import 'vidstack/bundle';
import 'vidstack/player/styles/base.css';
import 'vidstack/player/styles/default/theme.css';
import 'vidstack/player/styles/default/layouts/video.css';

import './assets/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Tres);
app.directive('reveal', revealDirective);

app.mount('#root');
