const Kao = require('koa')
const cors = require('koa2-cors')
const jsonp = require('koa-jsonp')

const localIpAddress = require("local-ip-address")

process.env.BASE_IP = localIpAddress()
console.log(process.env.BASE_IP);
const app = new Kao()
const PORT = 3001

app.use(cors())
app.use(jsonp())

require('./socket')(app)

// app.listen(PORT, () => {
//   console.log(`server start [${PORT}]!!!`)
// })

exports.module = app
