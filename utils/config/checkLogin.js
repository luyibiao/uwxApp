const storage = require('../../utils/helpers/storage.js');
const bizconsts = require('../variable/bizconsts.js')
const mutations=require("../helpers/mutations.js");
const methods=require("../helpers/methodser.js");
const wc=require("./wxConfig.js")
let resData,authFlag;

function getUerInfo() {
  const accountInfo = wx.getAccountInfoSync();
  
  getSessionId(accountInfo);
  wc.updateVersion();
}

//获得sessionID
function getSessionId(accountInfo) {
  wx.login({
    success: function (res) {
      let code = res.code;
      getApp().params.loginInfo["accountInfo"] = accountInfo;
      getApp().params.loginInfo["code"]=code;
      getApp().hep.dig();
      clearData();
      getApp().http({
        url: "wxUserInfo/open/appLogin",
        data: {
          appId: accountInfo.miniProgram.appId,
          code: code
        },
      }).then(res => {
        resData = res.data;
        setSessionId(resData.sessionId);
        resData.mercInfo.isOpenVipPrice = resData.isOpenVipPrice || 0;
        resData.mercInfo.takeTimeCount = resData.takeTimeCount || 5;
        storage.setMercInfo(resData.mercInfo);
        setCityFn();
      })
    }
  })
}

//初始化时清除不需要传的参数
function clearData() {
  getApp().params.sessionId = "";
}

//检验调用城市接口方法
function setCityFn() {
  getApp().params.authFlag = resData.toSaveWx //临时存储是否授权;
  let scene = getApp().hep.getScene('scene');
 
  if (scene == bizconsts.scene.CODE_SCENE && getApp().hep.getScene("query") && getApp().hep.getScene("query").code) {
    getCoubordCity();
  }
  else{
    getCity();
  }
  
  
}
//获得扫码模式柜子所在城市
function getCoubordCity() {
  getApp().http({
    url: "cupboard/open/cityInfo",
    data: {
      cupboardCode: getApp().hep.getScene('query').code
    }
  }).then(res => {
    let obj = res.data;
    mutations.updateCity(obj);
    checkLogin()
  })
}

//普通模式校验登录
function getCity() {
 
  storageData();
  if(resData.userInfo){
    // if(storage.getCityInfo()){
     
    //   //更新城市缓存配置文件
    //   updateCityConFig((data,obj)=>{
    //     if(data>-1){
         
    //       mutations.updateCity(obj);
    //     }
    //     getApp().hep.callback();
    //   });
    // }
    // else{
    //   // getApp().hep.callback();
    //   routeGo("/pages/mainPackage/place/locate/locate")
     
    // }
    methods.geOpenCityList((data) => {
      if (data.length == 1) {
        mutations.updateCity(data[0]);
        getApp().hep.callback();
      } else {
         if(storage.getCityInfo()){
          //更新城市缓存配置文件
          updateCityConFig((data,obj)=>{
            if(data>-1){
              mutations.updateCity(obj);
            }
            getApp().hep.callback();
          });
        }
        else{
          // getApp().hep.callback();
          routeGo("/pages/mainPackage/place/locate/locate")

        }
      }

    })
    wx.hideLoading();
  }
  else{
    // if (storage.getCityInfo()){
    //   updateCityConFig((data, obj) => {
    //     if (data > -1) {
    //       mutations.updateCity(obj);
    //     }
    //     getApp().hep.callback();
    //   });
    //   // getApp().hep.callback();
    // }
    // else{
    //   routeGo("/pages/mainPackage/place/locate/locate")
    // }
    methods.geOpenCityList((data) => {
      if(data.length == 1){
        mutations.updateCity(data[0]);
        getApp().hep.callback();
      }else{
        if (storage.getCityInfo()) {
          updateCityConFig((data, obj) => {
            if (data > -1) {
              mutations.updateCity(obj);
            }
            getApp().hep.callback();
          });
        // getApp().hep.callback();
        }
        else{
          routeGo("/pages/mainPackage/place/locate/locate")
        }
      }

    })
    wx.hideLoading();
  }
  wx.hideLoading();
}

//校验通过扫描柜子登录状态
function checkLogin() {
  if (!resData.userInfo) {
    routeGo("/pages/mainPackage/login/login");
  }
  else {
    storageData();
    getApp().hep.callback();
  }
  wx.hideLoading();
}

function setSessionId(sessionId) {
  getApp().params.sessionId = sessionId;
}

function routeGo(path) {
  getApp().hep.getScene('scene', { type: "rech", url: path })
}
function storageData(){
  storage.setUserInfo(resData.userInfo);
}

function updateCityConFig(fn){
  let openCityList = [];
  let storageCity=storage.getCityInfo() || {};
  methods.geOpenCityList((data) => {
    let index = -1;
    let cityInfo;
    openCityList = data;
    for(let i=0;i<openCityList.length;i++){
      if (methods.checkIncludes(openCityList[i].name, storageCity.name ? storageCity.name : "","includes")){
        index=i;
        cityInfo = openCityList[i];
        break;
      }
    }
    if(fn && typeof fn=="function"){
      fn(index, cityInfo);
    }
  })
}

module.exports = {
  getUerInfo
}