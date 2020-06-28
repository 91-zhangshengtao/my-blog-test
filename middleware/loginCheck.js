const { ErrorModel } = require('../model/resModel')

// 统一的登录验证函数
module.exports = (req, res, next) => {
  //  console.log('req.session.username:',req.session.username)
  if (!req.session.username) {
    res.json(
      Promise.resolve(
        new ErrorModel('尚未登录')
      )
    )
    return

  }
  next()

  //  原来写的
  //  if (!req.session.username) {
  //    return Promise.resolve(
  //       new ErrorModel('尚未登录')
  //    )
  //  }

}

