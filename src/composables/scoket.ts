
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

const IP = process.env.BASE_IP
const socket: Socket = io(`https://${IP}:8081`)

export default socket
