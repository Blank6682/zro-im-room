<script setup lang="ts">

const { targetUserName } = defineProps<{
  targetUserName: string | undefined
}>()

const emit = defineEmits<{
  (e: 'isShow'): void
}>()

const handleShow = () => {
  emit('isShow')
}
</script>

<template>
  <div @click="handleShow()" absolute top-0 left-0 w-h-screen bg-gray op-40 z-10> </div>
  <div class="private-chat" absolute bottom-0 left-0 w-full h-130 pb-15 bg-white rd-t-5 z-15>
    <div w-h-full mb-15 flex-col-center rd-t-5>
      <div w-30 text-center py-1 truncate>{{targetUserName}}</div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.private-chat {
  animation: showPrivate 0.8s ease;
}

@keyframes showPrivate {
  0% {
    transform: translateY(25rem);
  }

  100% {
    transform: translateY(0rem);
  }
}
</style>
