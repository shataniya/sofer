### A framework sofer that can quickly develop web servers
##### download
> npm i sofer
##### Instructions
```javascript
// server.js
const sofer = require("sofer")
const server = new sofer()
server.get("/index",function(ctx){
	ctx.body = "Hello World"
})
server.listen(3000)
```
##### testing
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191030214028342.png)
##### Request with parameters
```javascript
server.get("/index",function(ctx){
	// ctx.query can parse routing parameterscan
	ctx.body = ctx.query
})
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191030214612901.png)
##### Dynamic routing
```javascript
server.get("/index/:name",function(ctx){
	// ctx.params can parse Dynamic routing
	ctx.body = ctx.params
})
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191030214749481.png)
###### In the design of the registered route, I try to keep consistent with the koa framework.
### context
###### This is a very important concept, this is the encapsulation of request and response, context.req is request, context.res is response, in addition, some common properties are reset, see the following table.
|Attributes|Introduction|
|------|------
|context.url|Get the requested route
|context.method|get the request method, usually GET, or POST
|context.type|Can set the encoding method of response
|context.query|Get the parameters in the route
|context.params|Get the parameters of the dynamic route
|context.status|Can set the response status code
|context.header Or context.headers|Get the request header
|context.cookie|Get the cookie carried by the request header
|context.charset|Get the encoding method, the default is utf8
###### There are some commonly used function properties
|function|Introduction|
|------|------
|context.getHeader(name)|Get the attribute specified by the request header
|context.setHeader(name,value)|Set the specified response header
|context.accept(name)|Get the attribute at the beginning of the specified accpet- in the request header
|context.setCookie(name,value)|Set the cookie carried in the response header
|context.getCookie(name)|Get the specified cookie carried in the request header
|context.read(file-path)|Returns the specified file, file-path is the path to the file
|context.media(path,name,cb)|Process data from media files and set where files are stored
|context.mediaReader(path,name,cb)|Parsing information about media files and setting where files are stored
### Use of middleware
```javascript
// Registration middleware
server.use(middleware)
```
- Currently I just have two middleware built in, postparse and sofer-views.
- postparse is used to retrieve and parse post request data. Sofer-views is used to manage static resources. In fact, you can also write middleware, just use use() to register middleware.
```javascript
// If you need to use it, you can use the built-in middleware directly, or you can write middleware yourself.
server.use(sofer.postparse()).use(sofer.views())
```
### Module separation
- Inside the sofer is a built-in Router for module separation, and the route() function is used to register separate modules like this:
```javascript
// home.js
const sofer = require("sofer")
const Router = sofer.Router
const router = new Router()
router.get("/index",function(ctx){
	ctx.body = "this is a home index..."
})
module.exports = router
```
```javascript
// server.js
const sofer = require("sofer")
// Introducing the home module
const home = require("./home.js")
const server = new sofer()
server.get("/index",function(ctx){
	ctx.body = "Hello World"
})
// Registering a module using the route() function
server.route("/home",home)
server.listen(3000)
```


