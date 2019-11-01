const path = require("path")
const fs = require("fs")
const root = require("root-path-plugin")

module.exports = function(storepath,cb){
    var store = storepath && path.join(root,storepath) || path.join(root,"receive")
    var files = fs.readdirSync(root)
    var _flag = false // 默认是没有 receive文件夹
    for(let i=0,len=files.length;i<len;i++){
        if(files[i] === "receive"){
            _flag = true // 说明存在
            break
        }
    }
    if(!_flag){
        fs.mkdirSync(store)
    }
    return function(context,next){
        var data = []
        context.req.on("error",function(err){
            throw err
        })
        .on("data",function(chunk){
            data.push(chunk)
        })
        .on("end",function(){
            data = Buffer.concat(data).toString()
            if(/^data:image\/\w+;base64,/.test(data)){
                // Description is base64 data
                var base = data.replace(/^data:image\/\w+;base64,/, "")
                var base64 = Buffer.from(base,"base64")
                var now = Date.now()
                var callback = cb || _callback
                fs.writeFile(path.join(store,`image-${now}.jpg`),base64,callback)
                function _callback(){
                    console.log(`image-${now}.jpg has been saved in the ${store}`)
                }
            }
            next()
        })
    }
}