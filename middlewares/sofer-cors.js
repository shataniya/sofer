module.exports = function(path){
    var path = path || "*"
    return function(context,next){
        context.setHeader("Access-Control-Allow-Origin",path)
        next()
    }
}