import { createApp } from 'vue'
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
//     devtools.connect("http://localhost", "8098")
// }
mainApp.use(electronPlugin)
mainApp.use(router)
mainApp.mount('#app')
