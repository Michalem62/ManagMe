import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './MainProjectApp.vue'
import router from './router'
import { useThemeStore } from './stores/themeStore'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Motyw wczytujemy przed mount, żeby pierwsza klatka nie mignęła jasnym tłem
await useThemeStore().init()

app.mount('#app')
