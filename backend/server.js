var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')

var baseDirectory = path.join(__dirname, '..')
var frontendDirectory = path.join(baseDirectory, '/frontend')

var port = 8080

http.createServer(function (req, res) {
    try {
        var reqUrl = url.parse(req.url)

        if (req.url === '/') {
            var pathToIndexHtml = path.join(frontendDirectory, '/index.html')
            pathToIndex = path.normalize(pathToIndexHtml)
            fs.createReadStream(pathToIndexHtml).pipe(res)
        } else {
            var fsPath = path.join(frontendDirectory, path.normalize(reqUrl.pathname))
            var fileStream = fs.createReadStream(fsPath)
            fileStream.pipe(res)
            fileStream.on('open', function () {
                res.writeHead(200)
            })
            fileStream.on('error', function (e) {
                res.writeHead(404)
                res.end()
            })
        }
    } catch (e) {
        res.writeHead(500)
        res.end()
        console.log(e.stack)
    }
}).listen(port)

console.log("listening on port " + port)
console.log("baseDirectory: " + baseDirectory)
console.log("frontendDirectory:" + frontendDirectory)