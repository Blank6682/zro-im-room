import type { Toast } from './type';
import custToast from './custToast.vue';
import { render } from 'vue';

//创建dom容器
const div = document.createElement('div')
div.className = "message-container"
document.body.appendChild(div)

let timer = -1
const myToast = (obj: Toast = { text: '', type: "primary", duration: 1500 }) => {
  const vNode = h(custToast, obj)
  //将虚拟dom放入容器
  render(vNode, div)

  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, obj.duration || 1500)
}

myToast.primary = (value: string, duration: number = 1500) => {
  myToast({ type: 'primary', text: value, duration })
}

myToast.success = (value: string, duration: number = 1500) => {
  myToast({ type: 'success', text: value, duration })
}

myToast.wran = (value: string, duration: number = 1500) => {
  myToast({ type: 'wran', text: value, duration })
}
myToast.error = (value: string, duration: number = 1500) => {
  myToast({ type: 'error', text: value, duration })
}

export default myToast
