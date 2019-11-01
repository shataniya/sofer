const qs = require("querystring")
const pathtool = require("path")
const fs = require("fs")
const url = require("url")
// const path = require("path")


const _file = require("./common")._file

/**
 * Introduce the required modules
 */
const MediaModule = require("./context/media")
const MediaReader = require("./context/mediaReader")

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
            return url.parse(this.url,true).pathname
        },

        /**
         * return url params
         */
        get rootparams(){
            return this.search.replace("?","")
        },

        /**
         * return url search
         */
        get search(){
            return url.parse(this.url,true).search
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
         * @params name the attribute name of the request header
         */
        getHeader:function(name){
            return this.req.headers[name]
        },

        /**
         * function setHeader
         * @params name The name of the property to set
         * @params value The attribute value to be set
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
         * @params name  cookie-name
         * @params value cookie-value
         */
        setCookie:function(name,value){
            this.cookie = { [name]:value }
        },

        /**
         * function getCookie
         * @params name  The value of the cookie
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
        // This property remains to be discussed
        set type(val){
            var typeval = val+";charset="+this.charset
            this.res.setHeader("Content-Type",typeval)
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
            var type = _file[ext]
            this.type = type
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
        },

        /**
         * Temporary redirect
         */
        set redirect(path){
            this.status = 302
            this.setHeader("Location",path)
            this.body = "The current link has been temporarily redirected to another connection, please go to the link after the redirect to access"
        },

        /**
         * Handling data from media files and setting where to store media files
         * @params path     Store the root path of the media file
         * @params name     The name of the media file
         * @params callback Callback function triggered after the media file is saved
         */
        media:function(){
            var args = Array.from(arguments)
            MediaModule.apply(this,args)
        },

        /**
         * Parse the media file information and store the media file in the specified location
         * @params path     Store the root path of the media file
         * @params name     The name of the media file
         * @params callback Callback function triggered after the media file is saved
         * Media file data structure
         * @params File Information object of media file
         * @params FileReader  Media file data
         */
        mediaReader:function(){
            var args = Array.from(arguments)
            MediaReader.apply(this,args)
        }

    }
    return context
}