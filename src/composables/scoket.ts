
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

const socket: Socket = io(`https://192.168.1.2:8081`)

export default socket
