// 引入request模块
// var request = require("./request")
const qs = require("querystring")
const pathtool = require("path")
const fs = require("fs")

const filetype = require("./common").filetype

module.exports = function(req,res){
    var context = {
        req,
        res,
        /**
         * return request url
         */
        get url(){
            return this.req.url
        },
        set url(val){
            this.req.url = val
        },

        /**
         * return request rootUrl
         */
        get rootUrl(){
            if(this.url.indexOf("?") === -1){
                return this.url
            }
            return this.url.split("?")[0]
        },

        /**
         * return url params
         */
        get rootparams(){
            if(this.url.indexOf("?") === -1){
                return ""
            }
            return this.url.split("?")[1]
        },

        /**
         * return request method
         */
        get method(){
            return this.req.method
        },
        set method(val){
            this.req.method = val
        },

        /**
         * return request header
         */
        get header(){
            return this.req.headers
        },
        set header(val){
            this.req.headers = val
        },

        /**
         * function getHeader
         * @params name 想要获取请求头的属性名
         */
        getHeader:function(name){
            return this.req.headers[name]
        },

        /**
         * function setHeader
         * @params name 要设置的属性名
         * @params value 属性值
         */
        setHeader:function(name,value){
            this.res.setHeader(name,value)
        },

        /**
         * return request headers,alias as request header
         */
        get headers(){
            return this.req.headers
        },
        set headers(val){
            return this.req.headers = val
        },

        /**
         * return request host
         */
        get host(){
            return this.header.host
        },
        set host(val){
            this.header.host = val
        },

        /**
         * return request hostname
         */
        get hostname(){
            return this.header.host
        },
        set hostname(val){
            this.header.host = val
        },

        /**
         * return request path
         * only read
         */
        get path(){
            return "http://"+this.host+this.url
        },

        /**
         * return request socket
         * only read
         */
        get socket(){
            return this.req.socket
        },

        /**
         * return request ip
         */
        get ip(){
            return this.socket.remoteAddress
        },

        /**
         * return request accept
         */
        get accept(){
            return this.header.accept
        },

        /**
         * function accept
         */
        accept(val){
            return this.header["accept-"+val]
        },

        /**
         * return request cookie
         */
        get cookie(){
            return qs.parse(this.header.cookie,"; ")
        },
        set cookie(val){
            if(Object.prototype.toString.call(val) === "[object Object]"){
                this.res.setHeader("Set-Cookie",qs.stringify(val))
            }else{
                this.res.setHeader("Set-Cookie",val)
            }
        },

        /**
         * function setCookie
         * @params name  cookie的名称
         * @params value cookie的值
         */
        setCookie:function(name,value){
            this.cookie = { [name]:value }
        },

        /**
         * function getCookie
         * @params name  想要获取的cookie的值
         */
        getCookie:function(name){
            return this.cookie[name]
        },

        /**
         * return request type
         */
        get type(){
            var type = this.header["content-type"]
            if(!type){
                type = ""
            }
            return type
        },
        set type(val){
            this.res.setHeader("Content-Type",val)
        },

        /**
         * body
         */
        set body(val){
            if(Object.prototype.toString.call(val) === "[object Object]"){
                this.type = "text/json;charset=utf8"
                this.res.end(JSON.stringify(val))
            }
            this.res.end(val)
        },

        /**
         * query
         * Convert a parameter string to a parameter object
         */
        get query(){
            return qs.parse(this.rootparams)
        },

        /**
         * status
         */
        get status(){
            return this.req.statusCode
        },
        set status(val){
            this.res.statusCode = val
        },

        /**
         * function read
         * @params path  file path
         */
        read:function(path){
            var ext = pathtool.parse(path).ext
            var type = filetype[ext]
            this.type = type + ";charset=" + this.charset
            fs.createReadStream(path).pipe(this.res)
        },

        /**
         * charset
         */
        charsetEncoding:"utf8",
        get charset(){
            return this.charsetEncoding
        },
        set charset(val){
            this.charsetEncoding = val
        }

    }
    return context
}