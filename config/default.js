module.exports = {
  port: 4000,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mongodb: 'mongdb:localhost:27017/myblog'
}
