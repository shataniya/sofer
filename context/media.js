const path = require("path")
const fs = require("fs")
const root = require("root-path-plugin")
// const _file = require("../common")._file
const _type = require("../common")._type

/**
 * Handling data from media files and setting where to store media files
 * @params path     Store the root path of the media file
 * @params name     The name of the media file
 * @params callback Callback function triggered after the media file is saved
 */
module.exports = function(){
    var args = Array.from(arguments)
    var cb = args.pop(),
    name = args.pop(),
    mpth = args.shift();
    var now = Date.now()
    if(typeof cb !== "function"){
        mpth = name
        name = cb
        cb = null
    }
    name = name || "media-"+now
    mpth = mpth || "media"
    mpth = path.join(root,mpth)
    try{
        fs.mkdirSync(mpth)
    }catch(err){
        // The specified folder already exists and no need to create it
    }
    var data = []
    this.req.on("error",function(err){
        if(err) throw err
    })
    .on("data",function(chunk){
        data.push(chunk)
    })
    .on("end",function(){
        data = Buffer.concat(data).toString()
        if(/^data:[\w-\/]+;base64,/.test(data)){
            var ext = null
            var base = data.replace(/^data:([\w-\/]+);base64,/, function(match,key){
                ext = _type[key]
                return ""
            })
            var base64 = Buffer.from(base,"base64")
            var callback = cb || _callback
            var mName = name+ext
            fs.writeFile(path.join(mpth,mName),base64,callback)
            function _callback(){
                console.log("\033[34m"+mName+" has been saved in the "+mpth+"\033[39m")
            }
        }
    })
}