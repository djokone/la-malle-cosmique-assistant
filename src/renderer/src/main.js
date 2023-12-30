import { createApp } from 'vue'
// import devtools from '@vue/devtools'
import electronPlugin from './plugins/electron.js'
import { createRouter, createWebHistory } from 'vue-router'
import './style.scss'
import App from './App.vue'
import routes from './router'

const router = createRouter({
  history: createWebHistory(),
  routes
})


const mainApp = createApp(App)
// if (process.env.NODE_ENV === 'development') {
//     devtools.connect()
// }
mainApp.use(electronPlugin)
mainApp.use(router)
mainApp.mount('#app')
