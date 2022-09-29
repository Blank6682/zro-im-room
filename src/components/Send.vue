<script setup lang="ts">
let { msg } = defineProps<{
  msg: string
}>()
const emit = defineEmits<{
  (e: 'send',): void,
  (e: 'update:msg', m: string): void
}>()

const sendMsg = () => {
  emit('send')
  emit('update:msg', '')
}
const updateMsg = () => {
  emit('update:msg', msg)
}

</script>

<template>
  <div relative>
    <input type="text" v-model="msg" @input="updateMsg()" w-full py-2 pl-3 pr-9 rd-2 bg-gray-200 outline-none />
    <div @click="sendMsg()" i-carbon:send-alt-filled absolute top-2 right-2 text-6 text-gray
      active:transform="~ translate-y-2px" active:transition-all hover:cursor-pointer>
    </div>
  </div>
</template>

<style scoped>

</style>
