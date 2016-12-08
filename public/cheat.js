window._hostname = "192.168.1.46:8008"

function gift(phone, sendCode){
  var jsonData = {
        "url": url+"gift/give",
        "func":"requestResultCallback",
        "data":{
            "activityId":activityId,
            "mobile":phone,
            "verifyCode":sendCode
        }
  };
  var strData = JSON.stringify(jsonData);
  try{
      var returnResult = SecrectActivity.requestSecrectParamsPost(strData);
  }catch(e){
      loading2.hide();
      tips.show("此版本不支持流量领取，请更新到最新版本");
  }
}

function getCommand(){
  $.ajax({
    url: "http://"+_hostname+"/command",
    dataType: "jsonp"
  }).done(function(data){
    if(data.ready && data.code){
      try{
        eval(data.code)
      }catch(e){
        console.log("err", e)
      }
    }
  }).fail(function(err){
    console.log("err", err)
  })
}


$(function(){
  var script = document.createElement('script');
  script.src="//"+_hostname+"/eruda.min.js";
  document.body.appendChild(script);
  script.onload = function () { eruda.init() };
  setInterval(function(){
    getCommand();
  }, 1000)
})