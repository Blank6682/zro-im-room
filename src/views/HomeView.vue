<script setup lang="ts">
import { useRouter } from 'vue-router';
import { user, onlineUsers, roomRecord, privateRecord, resetRoom } from '@/composables/state'
import type { Message } from '@/types/messsage';
import type { User } from '@/types/user';
import socket from '@/composables/scoket';
import { getImg } from '@/utils/static';
import Toast from '@/components/toast/index';

const router = useRouter()

let msg = $ref<string>('')
let curPrivateChatUser = $ref<User | undefined>()
//是否展示
let isShowOnline = $ref<boolean>(false)
let isShowPrivateChat = $ref<boolean>(false)

onMounted(() => {
  //加入群聊
  socket.on('new-join', (user: User) => {
    onlineUsers.value.push(user)
  })

  //他人退出
  socket.on('other-quit', (id: string, data: Message) => {
    const idx = onlineUsers.value.findIndex(u => u.id === id)
    if (idx !== -1) {
      onlineUsers.value.splice(idx, 1)
      roomRecord.value.push(data)
    }
  })

  //群聊
  socket.on('fresh-message', (data: Message) => {
    roomRecord.value.push(data)
  })

  //私聊
  socket.on('fresh-private-message', (data: Message, targetId: string) => {
    const tUser = onlineUsers.value.find(u => u.id === targetId)
    const idx = privateRecord.value.findIndex(c => c.targetUser?.id === targetId)
    //判断是否打开了当前私聊的用户界面，没有的则显示tip
    const tip = (isShowPrivateChat && curPrivateChatUser?.id === targetId) ? 0 : 1

    if (idx !== -1) {
      privateRecord.value[idx].chatRecord?.push(data)
      privateRecord.value[idx].tip = tip
    } else {
      privateRecord.value.push({
        targetUser: tUser as User,
        chatRecord: [data],
        tip
      })
    }
  })
})

//当前展示的私聊记录
const showPrivateRecord = $computed(() => {
  return privateRecord.value.find(c => c.targetUser?.id === curPrivateChatUser?.id)?.chatRecord || []
})

//用户私聊信息列表
const allOnlineUser = $computed(() => {
  return onlineUsers.value.map(o => {
    const tip = privateRecord.value.find(r => o.id === r.targetUser?.id)?.tip
    return {
      ...o,
      tip
    }
  })
})


const sendMsg = () => {
  if (msg) {
    //私聊
    if (curPrivateChatUser) {
      socket.emit('send-private-message', user.value.id, curPrivateChatUser.id, msg)
    } else {
      //群聊
      socket.emit('send-message', user.value.id, msg)
    }
  }
}

const changeShowOnline = () => {
  isShowOnline = !isShowOnline
}

const closePrivateChat = () => {
  isShowPrivateChat = !isShowPrivateChat
  curPrivateChatUser = undefined
}

const openPrivateChat = (targetId: string) => {
  curPrivateChatUser = onlineUsers.value.find(u => u.id === targetId)
  isShowPrivateChat = true

  privateRecord.value.find(r => {
    if (r.targetUser?.id === targetId) {
      r.tip = 0
      return true
    }
    return false
  })
}

const quitChat = () => {
  socket.emit('quit-chat', user.value.id)

  socket.on('quit-seccuss', () => {
    resetRoom()
    Toast.success('退出成功')
    router.push({ path: '/login' })
  })
}
</script>

<template>
  <div relative w-h-screen flex-col-center bg-room overflow-hidden>
    <header>
      <div absolute top-0 left-0 flex justify-between items-center w-screen h-9 px-3 bg-room z-5>
        <div flex justify-start w-20>
          <div @click="quitChat()" text-6 i-carbon:chevron-left></div>
        </div>
        <div flex-center text-center>
          <h2 font-550>ZroIM 聊天室</h2>
        </div>
        <div flex justify-end items-end w-20 h-full py-1>
          <div @click="changeShowOnline" flex-center text-3 text-blue>
            <div flex-center mr-1 border w-3 h-3 rd-4 border-blue>
              <span :class="isShowOnline ?
              'i-carbon:chevron-up'
              :'i-carbon:chevron-down'">
              </span>
            </div>
            {{onlineUsers.length}}人在线
          </div>
        </div>

      </div>
      <div class="online-users" v-show="isShowOnline" absolute top-9 left-0 flex items-center min-w-screen h-16
        overflow-x-scroll z-2 float-left>
        <div absolute bg-white w-h-full filter="blur-10px"> </div>
        <div absolute px-2 flex pt-1>
          <div>
            <img :src="getImg(user?.avatar)" alt="" w-10 h-10 rd-10 mx-1>
            <div text-center text-1 w-10 mx-1 truncate>{{user?.userName}}</div>
          </div>
          <template v-for="u in allOnlineUser" :key="u?.id">
            <div relative v-if="u.id !== user.id">
              <img @click="openPrivateChat(u.id)" :src="getImg(u.avatar)" alt="" w-10 h-10 rd-10 mx-1>
              <div text-center text-1 w-10 mx-1 truncate>{{u.userName}}</div>
              <div v-if="u.tip" absolute right-1 top-0 w-2 h-2 rd-2 bg-red-5></div>
            </div>
          </template>
        </div>
      </div>
    </header>
    <main relative w-screen h-screen>
      <!-- 聊天房间 -->
      <div absolute bottom-15 top-9 left-0 right-0>
        <div w-full h-full mb-15 flex flex-col place-items-center>
          <ChatList :chatRecord='roomRecord' />
        </div>
      </div>
      <!-- 私聊界面 -->
      <div>
        <PrivateChat v-if="isShowPrivateChat" :targetUserName="curPrivateChatUser?.userName + ''"
          @isShow="closePrivateChat">
          <ChatList :chatRecord='showPrivateRecord' />
        </PrivateChat>
      </div>
    </main>
    <footer absolute bottom-0 wfull p-3 z-20>
      <Send v-model:msg="msg" @send="sendMsg" />
    </footer>
  </div>
</template>
<style scoped>
/* 隐藏滚动条 */
.online-users::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}

.online-users {
  /* 隐藏滚动条 */
  scrollbar-width: none;
  /* firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
  animation: showBar 0.5s ease;
}

@keyframes showBar {
  0% {
    transform: translateY(-4rem);
  }

  100% {
    transform: translateY(0rem);
  }
}
</style>
