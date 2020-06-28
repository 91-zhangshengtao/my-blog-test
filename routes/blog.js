const { getBlogList, getBlogDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

const express = require('express')
const router = express.Router()

// // 统一的登录验证函数
// const loginCheck =  (req, res, next) => {
//   if (!req.session.username) {
//     res.json(
//       Promise.resolve(
//         new ErrorModel('尚未登录')
//       )
//     )
//     return

//   }
//   next()
// }

/* req.query--get请求参数  req.body--post请求参数 */
// 1.blog-list
router.get('/list', function(req, res, next) {
  let author = req.query.author || ''
  const titlekr = req.query.titlekr || ''
  const isadmin = req.query.isadmin
  console.log('------------------isadmin：',isadmin)

  // 只返回属于自己的列表
  if (isadmin) {
    if (req.session.username === null) {
      console.error('is admin, but no login')
      // 未登录
      res.json(
        new ErrorModel('未登录')
      )
      return
    }
    // 强制查询自己的博客
    author = req.session.username
    // 强制查询自己的博客
    author = req.session.username
    console.log('author============，',author)

  }

  // mysql
  console.log(author,titlekr)

  return getBlogList(author,titlekr).then(blogListData=>{
    // 原来的方式
    // return new SuccessModel(blogListData)
    res.json(
      new SuccessModel(blogListData)
    )
  })

})
// 2.blog-detail
router.get('/detail', function(req, res, next) {
  const id = req.query.id || ''
  // mysql
  return getBlogDetail(id).then(blogDetailData=>{
    // 原来的方式
    // return new SuccessModel(blogDetailData)
    res.json(
      new SuccessModel({
        blogDetailData,
        session:req.session
      })
    )
  })

})
// 3.blog-new
router.post('/new', loginCheck, function(req, res, next) {
  // // 登录验证
  // const loginCheckResult = loginCheck(req)
  // if (loginCheckResult) {
  //   // 未登录
  //   return loginCheckResult
  // }

  req.body.author = req.session.username

  const author = req.body.author || ''
  const title = req.body.title || ''
  const content = req.body.content || ''

  // mysql
  return newBlog({author, title, content}).then(newBlogData=>{
    // return new SuccessModel(newBlogData)
    res.json(new SuccessModel(newBlogData))
  })
})
// 4.blog-update
router.post('/update', loginCheck, function(req, res, next) {
  // // 登录验证
  // const loginCheckResult = loginCheck(req,res)
  // if (loginCheckResult) {
  //   // 未登录
  //   return loginCheckResult
  // }

  const content = req.body.content || ''
  const title = req.body.title || ''
  const id = req.query.id || ''

  // mysql
  return updateBlog({title,content},id).then(updateBlogData=>{
    console.log('updateBlogData：',updateBlogData)

    if (updateBlogData){
      // return new SuccessModel(updateBlogData)
      res.json( new SuccessModel(updateBlogData))
    } else {
      // return new ErrorModel('更新博客失败')
      res.json(new ErrorModel('更新博客失败'))
    }
  })
})
// 5.blog-del
router.post('/delete', loginCheck, function(req, res, next) {
  // // 登录验证
  // const loginCheckResult = loginCheck(req,res)
  // if (loginCheckResult) {
  //   // 未登录
  //   return loginCheckResult
  // }

  const id = req.query.id || ''
  // const author ="wanger" //假数据
  const author = req.session.username

  // mysql
  return deleteBlog(id, author).then(deleteBlogData=>{
    if ( deleteBlogData ){
      // return new SuccessModel(deleteBlogData)
      res.json(new SuccessModel(deleteBlogData))
    } else {
      // return new ErrorModel('删除失败')
      res.json(new ErrorModel('删除失败'))
    }
  })
})


module.exports = router
