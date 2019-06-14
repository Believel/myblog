const marked = require('marked')
const Post = require('../libs/mongo').Post

// 将post的content从markdown转成html
Post.plugin('contentToHtml', {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne: function (post) {
    if (post) {
      post.content = marked(post.content)
    }
    return post
  }
})
module.exports = {
  // 创建一片文章
  create: function (post) {
    return Post.create(post).exec()
  },
  // 通过文章id获取一篇文章
  getPostById: function (postId) {
    return Post
      .findOne({
        _id: postId
      })
      .populate({
        path: 'author',
        model: 'User'
      })
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },
  // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
  getPosts: function (author) {
    const query = {}
    if (author) {
      query.author = author
    }
    return Post
      .find(query)
      .populate({
        path: 'author',
        model: 'User'
      })
      .sort({
        _id: -1
      })
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },
  // 通过文章 id 给 pv 加 1
  incPv: function (postId) {
    return Post.update({
      _id: postId
    }, {
      $inc: {
        pv: 1
      }
    })
  }
}
