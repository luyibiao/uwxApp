//app.js
var http = require("/utils/config/http.js");
var hep=require("/utils/helpers/uthelp.js");
var checkLogin=require("/utils/config/checkLogin.js");

App({
  onLaunch: function (option) {
    checkLogin.getUerInfo();
  },
  onShow:function(option){
  
    if (option.query && option.query.q) {
      let queryUrl = decodeURIComponent(option.query.q);
      let array = this.hep.getUrlParams(queryUrl)
      for (let i = 0; i < array.length;i++){
        for (let s in array[i]) {
          option.query[s] = array[i][s]
        }
      }
      
      // if ()
      // let action = this.hep.getQueryString(queryUrl, "action")
      // option.query["cupboardCode"] = this.hep.getQueryString(queryUrl, "code")
    }
    this.params.sceneData = option;
  },
  onError(res){
  },
  http: http.req,
  hep: hep,
  callbackFn(){},
  params: {
    sessionId: "", 
    sceneData:{}, //小程序启动时初始字段
    authFlag:"", //是否已授权用户信息
    loginInfo:{},// 登录所需信息
    userInfo: null 
  },
})