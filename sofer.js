const http = require("http")
const pathtool = require("path")
// const url = require("url")

var over = require("./context")

/**
 * sofer 一个类似于 koa的框架，目的就是方便构建一个web服务器
 */
function sofer(){
    // 用与存放中间件
    this.middlewares = []
}

/**
 * function use
 * @params fn  用于注册中间件 async/await
 */
sofer.prototype.use = function(fn){
    this.middlewares.push(fn)
    return this
}

/**
 * function compose 用于启动中间件
 * @params context 封装之后的上下文
 */
sofer.prototype.compose = function(context){
    var donext = (index)=>{
        if(index === this.middlewares.length){
            this.use((context,next)=>{
                context.status = 404
                context.body = "Not Fount"
            })
        }
        var fn = this.middlewares[index]
        fn && fn(context,()=>donext(index+1))
    }
    donext(0)
}

/**
 * function listen 封装http.createServer的listen
 * @params port 端口号
 * @params hostname 主机名
 * @params callback 服务器成功创建的时候调用的回调函数
 */
sofer.prototype.listen = function(){
    var args = Array.from(arguments)
    var port = args.shift() || 8080
    var callback = args.pop() || _callback
    function _callback(){
        console.log(`server running at http://localhost:${port}`)
    }
    var hostname = args.pop() || "localhost"
    // // 在这里处理没有注册的路由
    var server = http.createServer(this.callback())
    server.listen(port,hostname,callback)
}

/**
 * function callback
 */
sofer.prototype.callback = function(){
    return (req,res)=>{
        this.handle(req,res)
    }
}

/**
 * function handle 用于处理封装请求的对象和响应的对象
 */
sofer.prototype.handle = function(req,res){
    var context = over(req,res)
    this.compose(context)
}

/**
 * function get 用于处理get请求
 * @params path 请求的路由路径
 * @params fn   处理请求
 */
sofer.prototype.get = function(path,fn){
    this.use(function(context,next){
        if(context.method === "GET" && context.rootUrl === path){
            fn(context)
        }else if(context.method === "GET" && path.indexOf(":") !== -1){
            // 动态路由
            var dir = pathtool.parse(context.url).dir
            var base = pathtool.parse(context.url).base
            var pathdir = path.split(":")[0].replace(/\/$/g,"")
            var pathbase = path.split(":")[1]
            if(dir === pathdir){
                context.params = {}
                context.params[pathbase] = base
                fn(context)
            }else{
                next()
            }
        }else{
            next()
        }
        
    })
}

/**
 * function post 用于处理post请求
 * @params path 请求的路由路径
 * @params fn   处理请求
 */
sofer.prototype.post = function(path,fn){
    this.use(function(context,next){
        if(context.method === "POST" && context.rootUrl === path){
            fn(context)
        }else if(context.method === "POST" && path.indexOf(":") !== -1){
            // 动态路由
            var dir = pathtool.parse(context.url).dir
            var base = pathtool.parse(context.url).base
            var pathdir = path.split(":")[0].replace(/\/$/g,"")
            var pathbase = path.split(":")[1]
            if(dir === pathdir){
                context.params = {}
                context.params[pathbase] = base
                fn(context)
            }else{
                next()
            }
        }else{
            next()
        }
    })
}

/**
 * function route
 * @params path 这是根路径 rootpath
 * @params router 这是router实例，或者说router模块
 */
sofer.prototype.route = function(path,router){
    var routers = router.middlewares
    for(let o in routers){
        if(routers[o].method === "GET"){
            this.get(path+o,routers[o].callback)
        }
        if(routers[o].method === "POST"){
            this.post(path+o,routers[o].callback)
        }
    }
    return this
}

/**
 * router as a built-in module for sofer
 */
const Router = require("./router")
sofer.Router = Router

/**
 * sofer-views as a built-in module for sofer
 */
const soferViews = require("./middlewares/sofer-views")
sofer.views = soferViews

/**
 * PostParse is used to process the data of the post request
 */
const postparse = require("./middlewares/postparse")
sofer.postParse = postparse

/**
 * Sofer-cors is used to solve cross-domain problems
 */
const soferCors = require("./middlewares/sofer-cors")
sofer.cors = soferCors

module.exports = sofer


