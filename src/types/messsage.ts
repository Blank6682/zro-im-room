import type { User } from './user';

interface Message {
  type: number,
  user: User,
  createTime: Date,
  message: string
}

interface PrivateRecord {
  targetUser: User,
  chatRecord: Message[],
  tip: number,
}

export type { Message, PrivateRecord }
