import CustToast from './toast/index';
import type { App } from 'vue';

//注册全局组件
export default {
  install(app: App) {
    app.component('Toast', CustToast)
    //拓展一个全局属性
    app.config.globalProperties.$toast = CustToast
  }
}
