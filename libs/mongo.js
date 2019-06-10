const config = require('config-lite')(__dirname)
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

// 根据id生成创建时间created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  }
})
// 模式： 设计用户表: 用户名、密码、个人头像、性别、个人简介
exports.User = mongolass.model('User', {
  name: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true
  },
  avatar: {
    type: 'string',
    required: true
  },
  gender: {
    type: 'string',
    enum: ['m', 'f', 'x'],
    default: 'x'
  },
  bio: {
    type: 'string',
    required: true
  }
})
// 根据用户名找到用户，用户名全局唯一
exports.User.index({
  name: 1
}, {
  unique: true
}).exec()
