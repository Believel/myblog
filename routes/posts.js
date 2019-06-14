const express = require("express");
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin
const PostModel = require('../models/posts')

// GET /posts 所有用户或者特定用户的文章页
router.get('/', function (req, res, next) {
  const author = req.query.author
  PostModel.getPosts(author)
    .then(function (posts) {
      console.log(posts)
      res.render('posts', {
        posts: posts
      })
  }).catch(next)
})

// Post /posts/create 发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content
  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (error) {
    req.flash('error', error.message)
    return res.redirect('back')
  }
  let post = {
    author: author,
    title: title,
    content: content
  }
  PostModel.create(post)
    .then(function (result) {
      // 此post是插入mongodb后的值，包含_id
      post = result.ops[0]
      // 发表成功后跳转到该文章页
      res.redirect(`/posts/${post._id}`)
    }).catch(next)
})

// Get /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  res.render('create')
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
  res.send('文章详情页')
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章页')
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章')
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  res.send('删除文章')
})

module.exports = router
