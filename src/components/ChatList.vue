<script setup lang="ts">
import { user } from "@/composables/state";
import { dealTime } from '@/utils/fomat';

interface User {
  id: string
  userName: string,
  avatar: string
}

interface Message {
  type: number,
  user: User,
  createTime: Date,
  message: string | null
}

const { chatRecord = [] } = defineProps<{
  chatRecord: Message[] | undefined
}>()

const bottomLine = $ref<HTMLElement>()
let tipCount = $ref(0)

const targetRecord = $computed(() => {
  //消息时间相差超过5分钟则显示时间
  const MinShowMs = 5 * 60 * 1000
  return chatRecord?.map((c, idx) => {
    let showTime = ''
    if (idx) {
      let pre = new Date(chatRecord[idx - 1].createTime).getTime()
      let cur = new Date(chatRecord[idx].createTime).getTime()
      if (cur - pre > MinShowMs) {
        showTime = dealTime(cur)
      }
    }
    return {
      ...c,
      showTime
    }
  })
})

watch(chatRecord, () => {
  nextTick(() => {
    let btmLine = bottomLine?.getBoundingClientRect().bottom || 0
    if (btmLine > 940) {
      let len = chatRecord?.length
      if (chatRecord[len - 1]?.type === 3)
        tipCount++
    } else {
      let el = document.getElementById('room')
      if (el) {
        el.scrollTop = el.scrollHeight
        tipCount = 0
      }
    }
  })
})
const readNews = () => {
  let el = document.getElementById('room')
  if (el) {
    el.scrollTop = el.scrollHeight
    tipCount = 0
  }
}

</script>

<template>
  <div id="room" flex flex-col w-h-full px-3 overflow-y-scroll>
    <div v-for="(msg, idx) in targetRecord" :key="idx" py-1>
      <div text-center text-2 text-gray>
        {{msg.showTime}}
      </div>
      <!-- join and exit -->
      <div v-if=" [0,1].includes(msg.type)" py-2 text-center text-2 text-gray>
        {{ msg.type == 0 ?
        `欢迎 ${msg.user.userName} 加入群聊`
        :`${msg.user.userName} 退出了群聊`}}
      </div>
      <!-- chat message -->
      <div v-else-if="msg.type === 3">
        <!-- self -->
        <div v-if="msg.user.userName === user.userName" flex flex-row-reverse justify-start>
          <img :src="getImg(msg.user.avatar)" w10 h10 rd-10 />
          <div mr-2 max-w-65>
            <div mr-1 mb-1 text-2 text-gray text-end>
              {{ msg.user.userName }}
            </div>
            <div py-1 px-2 text-4 border rd-2 bg-chat break-all>
              {{ msg.message }}
            </div>
          </div>
        </div>
        <!-- other send -->
        <div v-else flex>
          <img :src="getImg(msg.user.avatar)" w10 h10 rd-10 />
          <div ml-2 max-w-65>
            <div ml-1 mb-1 text-2 text-gray>
              {{ msg.user.userName }}
            </div>
            <div py-1 px-2 border rd-2 bg-white text-4 break-all>
              {{ msg.message }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="tipCount" @click="readNews" class="tip" absolute bottom-2 right-3 flex-center text-center w-6 h-6 rd-7
      text-3 text-white bg-red bg-room>
      {{tipCount}}
    </div>
    <div ref="bottomLine"></div>
  </div>
</template>

<style scoped>
.tip {
  filter: drop-shadow(0 1px 1px #f87171a3);
}

.tip::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -12%;
  width: 1rem;
  height: 1rem;
  transform: translate(-50%) scaleX(.9) rotate(45deg);
  border-bottom: 1px solid #f87171;
  border-right: 1px solid #f87171;
  background: #f87171;
  z-index: -2;
}
</style>
