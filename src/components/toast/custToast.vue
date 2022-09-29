<script setup lang="ts" name="cutToast">
import type { ToastType } from './type';

interface StyleObj {
  [key: string]: {
    icon: string,
    color: string,
    backgroundColor: string
  }
}

interface ToastProps {
  text: string,
  type: ToastType,
  duration: number,
}

const { type = 'primary', text, duration = 1500 } = defineProps<ToastProps>()

const style: StyleObj = {
  primary: {
    icon: '',
    color: '#ffffff',
    backgroundColor: '#919191',
  },
  success: {
    icon: 'i-carbon:checkmark-outline',
    color: '#67C23A',
    backgroundColor: '#f3ffed',

  },
  wran: {
    icon: 'i-carbon:warning',
    color: '#E6A23C',
    backgroundColor: '#f9f0e4',
  },
  error: {
    icon: 'i-carbon:error',
    color: '#F56C6C',
    backgroundColor: '#f9f0f0',
  }
}

const curStyle = $computed(() => {
  return style[type]
})

let isShow = $ref(false)
onMounted(() => {
  isShow = true
})

onBeforeUnmount(() => {
  isShow = false
})

</script>
  
<template>

  <div fixed left="50%" top-20 transform="translate-x--50%">
    <Transition name="toast">
      <div v-show="isShow" :style="{color:curStyle.color,backgroundColor:curStyle.backgroundColor}" py-1 px-3 rd-2 flex
        text-center shadow-sm z-9999>
        <span v-if="curStyle.icon" :class="curStyle.icon" mt-1 mr-1></span>
        {{text}}
      </div>
    </Transition>
  </div>

</template>
  
<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all .8s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateY(-4rem);
  opacity: 0;
}
</style>
  