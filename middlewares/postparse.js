
const qs = require("querystring")
module.exports = function(){
    return function(context,next){
        var result = ""
        context.req.on("error",function(err){
            if(err) console.log(err)
        })
        .on("data",function(chunk){
            result += chunk
        })
        .on("end",function(){
            context.parse = qs.parse(result)
            next()
        })
    }
}