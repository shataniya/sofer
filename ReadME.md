##### This is a framework similar to koa, able to quickly develop web servers
- Download
```
npm i sofer
```
- Instructions
```javascript
const sofer = require("sofer")
const server = new sofer()
server.get("/index",function(ctx){
	ctx.body = "Hello World"
})
server.listen(3000)
```