import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import myComponents from './components/index';


; (async () => {
  const app = createApp(App)
  app.use(router)

  //注册全局组件
  app.use(myComponents)

  app.mount('#app')
})()
