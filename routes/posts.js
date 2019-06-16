const express = require("express");
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin
const PostModel = require('../models/posts')
const CommentModel = require("../models/comments")

// GET /posts 所有用户或者特定用户的文章页
router.get('/', function (req, res, next) {
  const author = req.query.author
  PostModel.getPosts(author)
    .then(function (posts) {
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
  // 获取地址栏参数
  const postId = req.params.postId
  Promise.all([
    PostModel.getPostById(postId), // 获取文章信息
    CommentModel.getComments(postId), // 获取该文章下的所有留言
    PostModel.incPv(postId) // pv加1
  ]).then(function (result) {
    const post = result[0]
    const comments = result[1]
    if (!post) {
      throw new Error('该文章不存在')
    }
    res.render('post', {
      post: post,
      comments: comments
    })
  }).catch(next)
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user._id
  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('该文章不存在')
      }
      if (author.toString() !== post.author._id.toString()) {
        throw new Error('权限不足')
      }
      res.render('edit', {
        post: post
      })
    })
    .catch(next)

})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
  const postId = req.params.postId
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
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }
  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      PostModel.updatePostById(postId, {
          title: title,
          content: content
        })
        .then(function () {
          req.flash('sucess', '编辑文章成功')
          // 编辑成功后跳到上一页
          res.redirect(`/posts/${postId}`)
        })
        .catch(next)
    })
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user._id

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      PostModel.delPostById(postId, author)
        .then(function () {
          req.flash('success', '删除文章成功')
          // 删除成功后跳转到主页
          res.redirect('/posts')
        })
        .catch(next)
    })
})

module.exports = router
