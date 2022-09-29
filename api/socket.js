const moment = require('moment')

//soclet 用户信息
let userList = []

//生成聊天内容
const transformContent = (userId, type, message = "") => {
  const user = userList.find(u => u.id === userId)

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

module.exports = app => {
  //配置socket.io
  const server = app.listen(8081)
  const { Server } = require('socket.io')
  //跨域
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  })

  io.on('connection', (socket) => {

    //加入群聊
    socket.on('join-chat', (userName, avatar) => {
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
    socket.on('quit-chat', userId => {
      const flag = userList.find(u => u.id === userId)
      if (flag) {
        const content = transformContent(userId, 1)
        userList = userList.filter(u => u.id !== userId)
        socket.emit('quit-seccuss', userId)
        socket.broadcast.emit('other-quit', userId, content)
      }
    })

    //发送信息
    socket.on('send-message', (userId, message) => {
      const content = transformContent(userId, 3, message)

      socket.broadcast.emit('fresh-message', content)
      socket.emit('fresh-message', content)
    })

    //一对一聊天falg
    socket.on('send-private-message', (userId, targetId, message) => {
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
}
