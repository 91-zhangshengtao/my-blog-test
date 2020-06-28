const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { genPassword } = require('../utils/cryp')
// const { set } = require('../db/redis')
var express = require('express')
var router = express.Router()

router.post('/login', function(req, res, next) {
  const username = req.body.username || ''
  let password = req.body.password || ''
  // 密匙 'WJiol_8776#'
  password = genPassword(password)
  console.log('password:',password)

  // 1. mysql
  return login({ username, password }).then(userLoginData=>{
    console.log('userLoginData-11:',userLoginData)

    if (userLoginData.username){
      // 设置session
      req.session.username = userLoginData.username
      req.session.realname = userLoginData.realname
      // 同步到 redis
      // set(req.session.id, req.session)

      /* 以下三个情况都可以 */

      // // 1.加Promise.resolve()
      // res.json( Promise.resolve(
      //     new SuccessModel({
      //       session:req.session
      //     })
      // ) )

      // 2.不加Promise.resolve()
      // return new SuccessModel({
      //   session:req.session
      // })
      res.json( new SuccessModel({
        session:req.session
      }) )

      // // 3.直接字符串或不写
      // res.json( new SuccessModel('登录成功') )
      // res.json( new SuccessModel() )
      return
    }
    // return new ErrorModel('登录失败')
    res.json(new ErrorModel('登录失败'))

  }).catch(error=>{
    console.log(error)
  }
  )

})

// const handleUserRouter = (req,res)=>{
// const method = req.method

//   if (method=='GET' && req.path=='/api/user/login-test'){
//     const username = req.query.username || ''
//     const password = req.query.password || ''

//     return login({ username, password }).then(userLoginData=>{
//       console.log('userLoginData-1:',userLoginData)// RowDataPacket { username: 'zhangsan', realname: '张三' }

//       if (userLoginData.username){
//         // 设置session
//         req.session.username = userLoginData.username
//         req.session.realname = userLoginData.realname
//         // 同步到 redis
//         set(req.session.id, req.session)

//         /* 以下三个情况都可以 */

//         // // 加Promise.resolve()
//         // return Promise.resolve(
//         //     new SuccessModel({
//         //       session:req.session
//         //     })
//         // )

//         // 不加Promise.resolve()
//         return new SuccessModel({
//           session:req.session
//         })

//         // // 直接字符串或不写
//         // return new SuccessModel('登录成功')
//         // return new SuccessModel()
//       }
//       return new ErrorModel('登录失败')

//     })
//   }
// }

module.exports = router