## 启动

```js
// 监视文件修改，不需要再次启动
supervisor index.js

// 单次启动，文件修改需要重新启动
node index.js

```

## 目录说明

1. `config`: 存放配置信息(session,mongodb 连接)
2. `coverage`: 测试代码的覆盖文件
3. `libs`: 存放 mongodb 的集合信息
4. `logs`: 存放日志文件
5. `middlewares`: 存放了 express 的中间件
6. `models`:存放操作数据库的文件
7. `public`:存放静态文件，如样式、图片等
8. `routes`:存放路由文件
9. `test`: 存放测试文件
10. `views`:存放模板文件
11. `index.js`:程序主文件
12. `package.json`:存储项目名、描述、作者、依赖等等信息

## 插件解读

1. `config-lite`是一个轻量的读取配置文件的模块
2. `mongolass`是 MongoDB 的驱动库
3. `express-formidable`是处理 form 表单(包括文件上传)
4. `winston`和`express-winston`用来记录日志
5. `mocha`和`supertest`用来测试

## 模板引擎(ejs)

1. ejs 有 3 中常用的标签

- `<% code %>`:运行 javascript 代码，不输出
- `<%= code %>`:显示转义后的 HTML 内容
- `<%- code %>`:显示原始 HTML 内容

## 中间件

> `express`中的中间件就是用来处理请求的，当一个中间件处理完，可以通过调用`next()`传递给下一个中间件，如果没有调用`next()`,则请求不会往下传递，如内置的`res.render`其实就是渲染完 html 直接返回客户端，没有调用`next()`，从而没有传递给下一个中间件

## app.locals 和 res.locals

> `express` 中的两个对象，可以用于模板的渲染。`app.locals`常用于挂载常量的信息，`res.locals`通常用于挂载变量的信息，即每次请求可能不一样的值

## 功能及路由设计

1. 注册

- 注册页：GET /signup
- 注册（包含上传头像）：POST /signup

2. 登录

- 登录页：GET /signin
- 登录：POST /signin
- 登出：GET /signout

3. 查看文章

- 主页：GET /posts
- 个人主页：GET /posts?author=xxx
- 查看一篇文章（包含留言）：GET /posts/:postId

4. 发表文章

- 发表文章页：GET /posts/create
- 发表文章：POST /posts/create

5. 修改文章

- 修改文章页：GET /posts/:postId/edit
- 修改文章：POST /posts/:postId/edit
  - 删除文章：GET /posts/:postId/remove

6. 留言

- 创建留言：POST /comments
- 删除留言：GET /comments/:commentId/remove
