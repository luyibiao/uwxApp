/**
 * 网络请求配置文件
 */
let env=require('./env.js');
let storage=require("../helpers/storage.js");

let errmsg="加载失败"

function req(option={}){
  let {
    url,
    data,
    responseType,
    success,
    fail,
  } = option;

  
  let cityId = storage.getCityInfo().id ? storage.getCityInfo().id : "";
  let dataObj={cityId:cityId}
  data=data ? { ...data, ...dataObj } : { ...dataObj};
  
  let toastDig;
  
  const method = option.method ? option.method : 'POST';

  const dataType = option.dataType ? option.dataType : 'json';

  const header=Object.assign({
    'content-type': 'application/x-www-form-urlencoded',
    'accept': 'application/json',
    'Cookie': (getApp().params.sessionId ? 'JSESSIONID=' + getApp().params.sessionId : '')
  },option.header);

  if (option.custom) {
    toastDig=true;
  }
  else {
    toastDig = false;
  }

  return new Promise((res,rej)=>{
    wx.request({
      url: env.API_URL+url,
      data,
      header,
      method,
      dataType,
      responseType,
      complete(r){
        let resData=r.data;
        let conObj={
          type: 'st',
          title: errmsg,
          icon: "error"
        }
        if (r.statusCode!==200){
          console.log(r,errmsg)
          dialog(conObj)
        }
        else{
          console.log(resData)
          if(resData.httpCode===200){
            res(resData);
          }
          else{
            if(!toastDig){
              errmsg = resData.msg;
              conObj.title = errmsg
              dialog(conObj);
              switch (resData.httpCode) {
                case 404: 
                  console.log(errmsg)
                  break;
                case 401:
                  console.log(errmsg)
                  // routeGo("ruch","/pages/mainPackage/login/login");
                  break;
                default:
                  break;
              }
            }
            else{
              res(resData);
            }
          }
        }
      }
    })
  })
}

function dialog(option){
  getApp().hep.dig(option);
}

function routeGo(type,path){
  getApp().hep.toRoute(type,path);
};


module.exports={
  req,
};