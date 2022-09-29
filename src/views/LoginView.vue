<script setup lang="ts">
import { user, onlineUsers } from "@/composables/state"
import { useRouter } from "vue-router"
import type { RouteComponent } from 'vue-router';
import scoket from '@/composables/scoket';
import type { User } from "@/types/user";

import { getImg } from "@/utils/static";
import Toast from '@/components/toast/index';

const router: RouteComponent = useRouter()

onBeforeMount(() => {
  user.value = {
    id: '',
    userName: '',
    avatar: 'avatar_1.webp'
  }
})

let isShowSelect = $ref(false)
//可选头像列表
const imgs = $computed(() => {
  let arr = []
  for (let i = 1; i <= 20; i++) {
    arr.push({
      imgUrl: `avatar_${i}.webp`
    })
  }
  return arr
})

//选中头像
const selectAvatar = (avatar: string) => {
  user.value.avatar = avatar
  setTimeout(() => {
    handleAvatarLayer()
  }, 200)
}

const handleAvatarLayer = () => {
  isShowSelect = !isShowSelect
}

//加入群聊
const login = () => {
  if (user.value.userName === '') {
    return Toast.wran('昵称不能为空哦')
  }
  console.log(101);

  scoket.emit('join-chat', user.value.userName, user.value.avatar)

  scoket.on('join-success', (socketId: string, userList: User[]) => {
    user.value.id = socketId
    onlineUsers.value = userList
    router.push({ path: '/' })
    Toast.success('Hello')
  })
}
</script>

<template>
  <div relative>
    <div flex-col-center text-center>
      <h1 text-primary mt25 font-550>欢迎进入ZroIM聊天室</h1>
      <div @click="handleAvatarLayer()" relative flex items-center mt13 mb-6 hover:cursor-pointer>
        <img v-if="user.avatar" :src="getImg(user.avatar)" alt="头像" w15 h15 rd-15 />
        <div v-else w15 h15 rd-15 bg-gray-200></div>
        <div i-carbon:caret-down absolute right--5 text-gray text-5></div>
      </div>
      <input type="text" v-model.layz="user.userName" placeholder="请取一个昵称" p2 w50 rd-2 text-center outline-none
        bg-input />
      <button @click="login()" w20 h20 mt23 rd-20 text-3 text-white bg-primary shadow>加入</button>
    </div>
    <!-- 选中头像 -->
    <div v-show="isShowSelect" absolute top-0>
      <div @click="handleAvatarLayer" w-h-screen bg-gray op-45></div>
      <div class="layer" absolute bottom-0 w-full h-85 p-2 rd-t-3 bg-white op-100 overflow-y-scroll>
        <div v-for="(i, idx) in imgs" :key="idx" @click="selectAvatar(i?.imgUrl)" relative>
          <img :src="getImg(i?.imgUrl)" alt="头像" w12 h12 rd-2 />
          <div v-if="i?.imgUrl === user.avatar" absolute bottom--3 left-5 w2 h2 rd-1 bg-primary></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
button {
  box-shadow: 0px 10px 30px #f5a47b;
}

button:active {
  transform: translateY(2px);
  transition: all 0.1s;
  box-shadow: none;
}

.layer {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-flow: row;
  grid-auto-rows: 5rem;
  place-items: center;
  animation: show 0.8s ease;
}


@keyframes show {
  0% {
    transform: translateY(20rem);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
