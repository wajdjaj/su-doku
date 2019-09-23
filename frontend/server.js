var express = require("express")
var favicon = require("serve-favicon")
var path = require("path")
var app = express()

const PORT = 8080;

app.use(express.static("./"))
app.use(favicon(path.join(__dirname, 'favicon.ico')))
app.listen(PORT, () => {
  console.log("frontend listening at " + PORT)
})
