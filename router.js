/**
 * class router
 */
function router(){
    this.middlewares = {}
}

router.prototype.get = function(path,fn){
    this.middlewares[path] = {
        callback:fn,
        method:"GET"
    }
}

router.prototype.post = function(path,fn){
    this.middlewares[path] = {
        callback:fn,
        method:"POST"
    }
}

router.prototype.route = function(path,Router){
    var routers = Router.middlewares
    for(let o in routers){
        if(routers[o].method === "GET"){
            this.get(path+o,routers[o].callback)
        }
        if(routers[o].method === "POST"){
            this.post(path+o,routers[o].callback)
        }
    }
}

module.exports = router