const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

// 创建连接对象
const con = mysql.createConnection(MYSQL_CONF)

// 连接
con.connect()

// sql函数
const exec = (sql) => {
  const promise = new Promise((resolve,reject)=>{
    con.query(sql,(err,res)=>{
      if (err){
        // console.log(err)
        reject(err)
        return
      }
      // console.log(res)
      resolve(res)
    })
  })

  return promise
}

module.exports = {
  exec,
  escape: mysql.escape
}