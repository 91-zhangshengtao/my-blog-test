const createError = require('http-errors')
const express = require('express')
const path = require('path')
var fs = require('fs')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { redisClient } = require('./db/redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
//
var blogRouter = require('./routes/blog')
var userRouter = require('./routes/user')
const ENV = process.env.NODE_ENV

var app = express()

/* 前端页面的设置 */
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

/* 自动生成日志 --morgan模块 */
if (ENV !== 'production') {
  // 开发环境 / 测试环境
  app.use(logger('dev'))
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }))
}

// 自动接收post请求的json数据 --req.body获取
app.use(express.json())
// 自动接收post请求的x-www-form-urlencoded的数据 --req.body获取
app.use(express.urlencoded({ extended: false }))

// 处理cookie --之前自己写方法添加的
app.use(cookieParser())
// 前端静态资源
app.use(express.static(path.join(__dirname, 'public')))

/* session(cookie) redis */
const sessionStore = new RedisStore({
  client: redisClient
})
// res.setHeader("Set-Cookie",`userid=${userId}; path=/;
// httpOnly; expires=${getCookieExpires()}`)
app.use(session({
  secret: 'WJiol#23123_',
  cookie: {
    // path: '/',   // 默认配置
    // httpOnly: true,  // 默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

/* 注册路由 */
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, { expose: false }))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'dev' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})


// 获取cookie过期时间
const getCookieExpires = ()=>{
  const d = new Date()
  d.setTime(d.getTime() + 24*60*60*1000)
  return d.toGMTString()
}

module.exports = app
