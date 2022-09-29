
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

console.log(import.meta.env);

const socket: Socket = io(`https://${import.meta.env.BASE_IP}:8081`)

export default socket
