const { exec } = require('../db/mysql')
const xss = require('xss')


const getBlogList = (author, titlekr) =>{

  // 1.mysql
  // where 1=1 只是占位置 记得加空格
  let sql = 'select * from blogs where 1=1 '
  if (author){
    sql += `and author="${author}" `
  }
  if (titlekr){
    titlekr = titlekr.substring(1,titlekr.length-1)
    let keyword = `"%${titlekr}%"`
    sql += `and title like ${keyword} `
  }
  sql += 'order by createTime desc;'
  // 返回promise对象
  return exec(sql)

  // // 2.Mock
  // return {
  //   data: [
  //     {
  //       id:1,
  //       title:"标题A",
  //       content:"内容A",
  //       createTime:1584174291092,
  //       author:"zhangsan"
  //     }
  //   ]
  // }
}
const getBlogDetail = id =>{
  console.log('Blogdetail id:',id)

  // 1.mysql
  let sql = `select * from blogs where id=${id}`
  // 返回promise对象
  return exec(sql).then(rows=>{
    //详情是就单条数据
    return rows[0]
  })

  // //2.Mock
  // return {
  //   data:{
  //     id:1,
  //     title:'标题A',
  //     content:'内容A',
  //     createTime: 1584174291092,
  //     author:'zhangsan'
  //   }
  // }

}
const newBlog = (blogData = {})=>{
  console.log('newBlog blogData:',blogData)
  let {author,title,content} = blogData

  // 防xss
  author = xss(author)
  title = xss(title)
  content = xss(content)

  const createTime = Date.now()
  // 1.mysql
  let sql = `
    insert into blogs(author,title,content,createTime) 
    values("${author}","${title}","${content}","${createTime}")`
  // 返回promise对象
  return exec(sql).then(insertData=>{
    console.log('insertData:',insertData)
    //详情是就单条数据
    if (insertData.affectedRows > 0){
      return {insertData: insertData}
    }
    return false
  })

  // // 2.Mock
  // return {
  //   data:{ id: 3},
  //   errno: 0
  // }
}
const updateBlog = ( blogData={}, id)=>{
  console.log('updateBlog blogData:',blogData)
  let {title, content}= blogData

  // 防xss
  title = xss(title)
  content = xss(content)

  const createTime = Date.now()
  // 1.mysql
  let sql = `
    update blogs set title="${title}", content="${content}", createTime=${createTime} 
    where id=${id}`
  // 返回promise对象
  return exec(sql).then(updateData=>{
    //详情是就单条数据
    if (updateData.affectedRows > 0){
      return {updateData: updateData}
    }
    return false
  })

  // // 2.Mock
  // return {
  //   data:{},
  //   errno:0
  // }
  // //return false
}
const deleteBlog = (id,author) =>{
  console.log('deleteBlog id1:',id)
  console.log('deleteBlog author1:',author)


  // 1.mysql
  // and author="${author}"
  let sql = `delete from blogs where id=${id};`
  // 返回promise对象
  return exec(sql).then(deleteData=>{
    console.log('deleteData:',deleteData)

    if (deleteData.affectedRows > 0){
      return {deleteData: deleteData}
    }
    return false
  })

  // // 2.Mock
  // return {
  //   data:{},
  //   errno:0
  // }
}


module.exports = { getBlogList, getBlogDetail, newBlog, updateBlog, deleteBlog }