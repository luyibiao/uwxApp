const storage=require("../helpers/storage.js");
var callbackFn;
var pageRoute;

function listenRoute(fn,page=""){
  if(fn){
    callbackFn=fn;
  }
  if(page!=""){
    pageRoute = page
  }
  if (getApp().params.sessionId && storage.getCityInfo()){
    //如果是首页或者没有传路由的页面，都按首页流程处理
    if (pageRoute == "pages/mainPackage/tabbar/index/index" || !pageRoute){
      indexTab();
    }
    else {
      otherPage();
    }
  }
  else{
    if (pageRoute){
      storage.setStorage("GO_PAGE", `/${pageRoute}`); //如果刚开始进来的不是首页，则把页面缓存下来
    }
  }
}

//如果是首页,则不需要判断登录,直接回调
function indexTab(){
  if(checkTypeofFn()){
    callbackFn();
  }
}

//其他页面需要先判断登录
function otherPage(){
  if (!storage.getUserInfo()) {
    storage.setStorage("GO_PAGE", `/${pageRoute}`); //如果进来的是首页，当点击其他页面时且未登录时将页面缓存
    getApp().hep.toRoute("rech", "/pages/mainPackage/login/login");
  }
  else {
    if (storage.getStorage("GO_PAGE")){
      storage.removeStorage("GO_PAGE")
    }
    if (checkTypeofFn()) {
      callbackFn();
    }
  }
}

function checkTypeofFn(){
  if (callbackFn && typeof callbackFn == "function") {
      return true;
  }
  return false
}

module.exports={
  listenRoute
}