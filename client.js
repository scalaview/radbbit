var http = require('http')
var request = require("request")
var express = require("express")
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var app = express();
app.set('port', process.env.PORT || 80);
app.enable('verbose errors');

app.use(express.query());
app.use(urlencodedParser)
app.use(jsonParser)

var defaultResponse = {
  "LicenseResult": 1,
  "LicenseValue": 100,
  "Module": 2
}

app.use("*", function(req, res, next) {
  console.log(req.method + " : " + req.url)
  var contentType = req.headers['content-type'] || '',
      mime = contentType.split(';')[0];
  var target = req.originalUrl
  if(target.toLowerCase().indexOf("http")== -1){
    target = "http://pro.protchar.cn" + target
  }
  if (req.method == 'POST' || req.method == 'PUT') {
    var options = {
      headers: req.headers,
      url: target
    }
    options.headers["originhost"] = req.headers.host
    if(mime.indexOf('x-www-form-urlencoded') != -1){
      options["form"] = req.body
    }else if(mime.indexOf('form-data') != -1){
      options["formData"] = req.body
    }
    request.post(options, function(err, hostres, body){
      if (!err && hostres.statusCode == 200) {
        var rdata = data = hostres.body.trim()
        console.log(data)
        try{
          var rdata = JSON.parse(data)
        }catch(e){
          console.log("json format error")
        }
        res.json(rdata)
      }else{
        console.log(err)
        res.json(defaultResponse)
      }
    })
  }else if (req.method === 'GET' || req.method === 'HEAD') {
    request.get(target).pipe(res)
  }
})


app.use(function(err, req, res, next){
  console.log(err)
  res.status(err.status || 500);
});

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});