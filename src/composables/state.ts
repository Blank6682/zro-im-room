import type { User } from '@/types/user';
import type { Message, PrivateRecord } from '@/types/messsage';

export const user = useSessionStorage<User>('user', {
  id: '',
  userName: '',
  avatar: 'avatar_1.webp'
})

export const onlineUsers = useSessionStorage<User[]>('online-user', [])

//房间聊天记录
export const roomRecord = useSessionStorage<Message[]>('room-record', [])

//私聊聊天记录
export const privateRecord = useSessionStorage<PrivateRecord[]>('private-record', [])

export const resetRoom = () => {
  roomRecord.value = []
  privateRecord.value = []
  onlineUsers.value = []
}

