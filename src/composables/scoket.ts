
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

const socket: Socket = io(`https://${import.meta.env.VITE_BASE_IP}:8081`)

export default socket
