const marked = require('marked')
const Post = require('../libs/mongo').Post
const CommentModel = require('./comments')

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
// 给post添加留言数commentsCount
Post.plugin('addCommentsCount', {
  afterFind: function (posts) {
    return Promise.all(posts.map(function (post) {
      return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
        post.commentsCount = commentsCount
        return post
      })
    }))
  },
  afterFindOne: function (post) {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then(function (count) {
        post.commentsCount = count
        return post
      })
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
      .addCommentsCount()
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
      .addCommentsCount()
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
  },
  // 通过文章id获取一篇原生文章(编辑文章)
  getRawPostById: function (postId) {
    return Post.findOne({
      _id: postId
    }).populate({
      path: 'author',
      model: 'User'
    }).exec()
  },
  // 通过文章id更新一篇文章
  updatePostById: function (postId, data) {
    return Post.update({
      _id: postId
    }, {
      $set: data
    }).exec()
  },
  // 通过用户id和文章id删除一篇文章
  delPostById: function (postId, author) {
    return Post.deleteOne({
      author: author,
      _id: postId
    }).exec().then(function (res) {
      // 文章删除后，再删除该文章下的所有留言
      if (res.result.ok && res.result.n > 0) {
        return CommentModel.delCommentsByPostId(postId)
      }
    })
  }
}
