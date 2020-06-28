const { exec, escape } = require('../db/mysql') // 引入 escape 去引号
const { genPassword } = require('../utils/cryp')


const login = userData =>{
  // 密码加密
  // let password = genPassword(userData.password)
  let password = userData.password

  // 防sql注入
  const username = escape(userData.username)
  password = escape(password)


  // 1.mysql
  let sql = `select username,realname from users where username=${username} and password=${password}`
  console.log('sql:',sql)

  // 返回promise对象
  return exec(sql).then(userRows=>{
    // console.log('userRows:',userRows)

    // return userRows[0] || {}
    if (userRows && userRows.length){
      return userRows[0] //{}
    } else {
      return false
    }
  })

  // // 2.Mock
  // if(username == 'zst' && password == '123456'){
  //   return true
  // }
  // return false
}

module.exports = { login }