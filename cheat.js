var request = require("request")
var express = require("express")
var bodyParser = require('body-parser')
var _ = require('lodash')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var app = express();
app.set('port', process.env.PORT || 8008);
app.enable('verbose errors');

app.use(express.query());
app.use(urlencodedParser)
app.use(jsonParser)
app.use(express.static(__dirname + '/public'));


var urls = ['http://112.74.141.140/amuc/api/activity/getActivityList']

app.get("/command", function(req, res){
  console.log("request ok")
  res.jsonp({ready: 1, code: "console.log('ok')"})
})

app.use("*", function(req, res, next) {
  console.log(req.method + " : " + req.originalUrl)

  var contentType = req.headers['content-type'] || '',
      mime = contentType.split(';')[0];
  var target = req.originalUrl
  console.log("target:" + target)
  if (req.method == 'POST' || req.method == 'PUT') {
    var options = {
      headers: req.headers,
      url: target
    }
    options.headers.host = req.headers.originhost
    if(mime.indexOf('x-www-form-urlencoded') != -1){
      options["form"] = req.body
    }else if(mime.indexOf('form-data') != -1){
      options["formData"] = req.body
    }
    if(_.includes(urls, req.originalUrl.split("?").shift()) ){
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
    }else{
      req.pipe(request.post(options), {end: false}).pipe(res);
    }
  }else if (req.method === 'GET' || req.method === 'HEAD') {
    var path = req.originalUrl.split("?").shift()
    if(path == 'http://112.74.141.140/amuc/api/activity/getActivityList' ){
      request.get(target, function(err, hostres, body){
        res.set(hostres.headers)
        if (!err && hostres.statusCode == 200) {
          var rdata = data = hostres.body.trim()
          console.log(data)
          try{
            var rdata = JSON.parse(data)
            for (var i = 0; i < rdata.result.length; i++) {
              if(rdata.result[i].aOtherAddress && rdata.result[i].aOtherAddress == 'http://hd5.nfapp.southcn.com/lxyz2/app/index.html?paperId=92'){
                rdata.result[i].aOtherAddress = 'http://static.nfapp.southcn.com/lxyzGetFlow/getFlow.html'
              }
            }
            for (var i in hostres.headers) {
              if(!_.includes(res.headers, i)){

              }
            }
          }catch(e){
            console.log("json format error", e)
          }
          res.json(rdata)
        }else{
          console.log(err)
          res.json({})
        }
      })
    }else if(path == 'http://static.nfapp.southcn.com/lxyzGetFlow/getFlow.html'){
      request.get(target, function(err, hostres, body){
        res.set(hostres.headers)
        if (!err && hostres.statusCode == 200) {
          var data = hostres.body.trim()
          console.log(data)
          try{
            if(data.indexOf('</body>') !== -1){
              data = data.replace('</body>', '<script src="http://192.168.1.46:8008/cheat.js"></script></body>')
            }
            console.log("data", data)
          }catch(e){
            console.log("json format error", e)
          }
          res.send(data)
        }else{
          console.log(err)
          res.send("")
        }
      })
    }else{
      request.get(target).pipe(res)
    }
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