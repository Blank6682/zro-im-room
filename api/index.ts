import Koa from 'koa'
import cors from 'koa2-cors';
import jsonp from 'koa-jsonp';
import moment from 'moment';
import { Server } from 'socket.io';
import localIpAddress from "local-ip-address";

process.env.VITE_BASE_IP = localIpAddress()

const app = new Koa()

app.use(cors())
app.use(jsonp())

interface User {
  id: string
  userName: string,
  avatar: string
}

//soclet 用户信息
let userList: User[] = []

//生成聊天内容
const transformContent = (userId: string, type: number, message: string = "") => {
  const user = userList.find(u => u.id === userId)
  if (user)
    switch (type) {
      case 0://加入群聊
        message = `欢迎 ${user.userName} 加入了群聊`
        break;
      case 1: //退出群聊
        message = `${user.userName} 退出了群聊`
        break
      default:
        break
    }
  const createTime = moment().format('YYYY-MM-DD HH:mm:ss')
  const content = {
    type,
    user,
    message,
    createTime
  }
  return content
}

//配置socket.io
const server = app.listen(8081)
//跨域
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket) => {
  //加入群聊
  socket.on('join-chat', (userName: string, avatar: string) => {
    const user = {
      id: socket.id,
      userName,
      avatar
    }
    userList.push(user)
    const content = transformContent(socket.id, 0)

    //把当前socketId发送给用户当成唯一标识
    socket.emit('join-success', socket.id, userList)
    //广播进入群聊
    socket.broadcast.emit('new-join', user)

    socket.emit('fresh-message', content)
    //广播消息
    socket.broadcast.emit('fresh-message', content)
  })

  //退出群聊
  socket.on('quit-chat', (userId: string) => {
    const flag = userList.find(u => u.id === userId)
    if (flag) {
      const content = transformContent(userId, 1)
      userList = userList.filter(u => u.id !== userId)
      socket.emit('quit-seccuss', userId)
      socket.broadcast.emit('other-quit', userId, content)
    }
  })

  //发送信息
  socket.on('send-message', (userId: string, message: string) => {
    const content = transformContent(userId, 3, message)

    socket.broadcast.emit('fresh-message', content)
    socket.emit('fresh-message', content)
  })

  //一对一聊天falg
  socket.on('send-private-message', (userId: string, targetId: string, message: string) => {
    const content = transformContent(userId, 3, message)

    socket.to(targetId).emit('fresh-private-message', content, userId)
    socket.emit('fresh-private-message', content, targetId)
  })

  //用户关闭页面断开连接
  socket.on("disconnect", async () => {
    const userId = socket.id
    const flag = userList.find(u => u.id === userId)
    if (flag) {
      const content = transformContent(userId, 1)
      userList = userList.filter(u => u.id !== userId)
      socket.broadcast.emit('other-quit', userId, content)
    }
  });
});

export default app
