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
 * 
 * Media file data structure
 * @params File Information object of media file
 * @params FileReader  Media file data
 */
module.exports = function(){
    var args = Array.from(arguments)
    var cb = args.pop(),
    name = args.pop(),
    mpth = args.shift();
    if(typeof cb !== "function"){
        name = cb
        cb = null
    }
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
        var trans_data = JSON.parse(data)
        var File = trans_data.File
        var FileReader = trans_data.FileReader
        name = File.name
        if(/^data:[\w-\/]+;base64,/.test(FileReader.result)){
            var ext = _type[File.type]
            var base = FileReader.result.replace(/^data:([\w-\/]+);base64,/, "")
            var base64 = Buffer.from(base,"base64")
            var callback = cb || _callback
            if(path.parse(name).ext){
                var mName = name
            }else{
                var mName = name+ext
            }
            fs.writeFile(path.join(mpth,mName),base64,callback)
            function _callback(){
                console.log(`${mName} has been saved in the ${mpth}`)
            }
        }
    })
}