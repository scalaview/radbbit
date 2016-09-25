var http = require('http'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer();

http.createServer(function (req, res) {
  var target = req.url
  if(target.toLowerCase().indexOf("http")== -1){
    target = "http://" + req.headers.host + target
  }
  console.log(target, req.method)
  proxy.web(req, res, {
    target: target
  });
}).listen(8008);

proxy.on('proxyRes', function (proxyRes, req, res) {
  var _write = res.write;
  res.write = function (data) {
    try{
      var tmpData = JSON.parse(data)
      if(tmpData.LicenseResult && tmpData.LicenseResult != 1 ){
        tmpData.LicenseResult = 1
      }
      var rdata = new Buffer(JSON.stringify(tmpData))
    }catch(e){
      var rdata = data
    }
    _write.call(res, rdata);
  }
});


proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'application/json; charset=utf-8'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});