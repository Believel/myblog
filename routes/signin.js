const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

// Get /signin 登录页
router.get('/', checkLogin, function (req, res, next) {
  res.send('登录页')
})

// Post /signin 用户登录
router.post('/', checkLogin, function (req, res, next) {
  res.send('登录')
})
module.exports = router
