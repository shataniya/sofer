const fs = require("fs")
const root = require("root-path-plugin")
const path = require("path")

module.exports = function(html_path,options){
    var htmlpath = html_path || "model"
    htmlpath = path.join(root,htmlpath)
    return function(ctx,next){
        ctx.model = function(file_path,data){
            var temp = fs.readFileSync(path.join(htmlpath,file_path)).toString()
            // 将所有 {{key}} 替换成 相应的数据
            this.body = temp.replace(/{-include([^{}]+)}/g,function(match,key){
                var path = key.trim().replace(/["''"]/g,"")
                var childtemp = fs.readFileSync(htmlpath+"/"+path)
                return childtemp
            }).replace(/{{([^{}]+)}}/g,function(match,key){
                return data[key.trim()]
            }).replace(/{if([^{}]+)}([^{}]+){\/if}/g,function(match,key1,key2){
                // if
                if(data[key1.trim()]){
                    return key2.trim()
                }
                return ""
            }).replace(/{for([^{}]+)}([^\bfor\b]+){\/for}/g,function(match,key1,key2){
                // for
                var obj = data[key1.trim()]
                var s = ""
                if(Object.prototype.toString.call(obj) === "[object Object]"){
                    // 说明obj是一个对象
                    for(let o in obj){
                        s += key2.trim().replace(/{\$([^{}]+)}/g,function(match,key){
                            if(key.trim() === "key"){
                                return o
                            }
                            if(key.trim() === "value"){
                                return obj[o]
                            }
                        })
                    }
                    return s
                }
                if(Object.prototype.toString.call(obj) === "[object Array]"){
                    // 说明obj是一个数组
                    for(let i=0,len=obj.length;i<len;i++){
                        s += key2.trim().replace(/{\$([^{}]+)}/g,function(match,key){
                            if(key.trim() === "index"){
                                return i
                            }
                            if(key.trim() === "value"){
                                return obj[i]
                            }
                            if(/\./g.check(key.trim())){
                                // 说明使用了 {$value.key} 的形式
                                var arr = key.trim().split(".")
                                var ap = obj[i]
                                for(let j=1,len=arr.length;j<len;j++){
                                    ap = ap[arr[j]]
                                }
                                return ap
                            }
                        })
                    }
                    return s
                }
            })
        }
        next()
    }
}