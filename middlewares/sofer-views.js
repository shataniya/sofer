const filetype = require("../common").filetype
const root = require("root-path-plugin")
const path = require("path")
/**
 * Manage static resources
 * @params viewUrl Static resource storage address
 * @params options Parameter configuration for static resources
 */
module.exports = function(viewUrl,options){
    var vurl = viewUrl && path.join(root,viewUrl) || path.join(root,"views") // By default, static resources are stored in the views folder.
    return function(context,next){
        var ext = path.parse(context.url,true).ext
        context.viewPath = vurl
        if(ext){
            var type = filetype[ext]
            context.type = type
            context.read(path.join(vurl,context.url))
        }else{
            next()
        }
    }
}