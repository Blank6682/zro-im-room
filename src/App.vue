<script setup lang="ts">
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped>
body {
  position: relative;
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  box-sizing: content-box;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  /* firefox */
  -ms-overflow-style: none;
}

body::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}
</style>
