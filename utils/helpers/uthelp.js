/**
 * 全局公共方法存放文件
 */

const route=require("../view/toRoute.js");
const dig=require("../view/dialog.js");
const listenRoute = require("../view/listenRoute.js")
const bizconsts=require("../variable/bizconsts.js");
const storage=require("../helpers/storage.js");
var callbackFn;

module.exports={
  /**
   * 获取事件传过来参数
   * 有val获取具体对象的具体某一个值，key为对象，val为键
   * 无val有key获取某一个参数对象，key为对象
   * 无key获取参数列表
   */
  dataset:function(event,key,val){
    return val ? event.currentTarget.dataset[key][val] : key ? event.currentTarget.dataset[key] : event.currentTarget;
  },

  /**
   * 获取初始参数
   * key:获取的具体参数
   * opt:是否针对不同场景值跳转不同界面,值为封装的跳转路由对象，可不填
   */
  getScene:function(key,opt){
    let str = getApp().params.sceneData[key];
    if (!opt){
      return str;
    }
    else{
      let path;
      if (str === bizconsts.scene.CODE_SCENE && getApp().params.sceneData["query"] && getApp().params.sceneData["query"].code){
        path = opt.url ? opt.url : "/pages/subPackage/cabinet/index/index";
      }
      else{
        path = opt.url ? opt.url : "/pages/mainPackage/tabbar/index/index";
      }
      this.toRoute(opt.type,path)
    }
  },

  /**
   * 获取解码过来的url参数
   */
  getQueryString:function(url,name){
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i');
    var r = url.substr(1).match(reg)
    if (r != null) {
      return r[2]
    }
    return null;
  },

  // 获取地址栏的参数数组
  getUrlParams: function (search) {
    //var search = window.location.search;
    // 写入数据字典
    var tmparray = search.substr(search.indexOf('?')+1, search.length).split("&");
    var paramsArray = new Array;
    if (tmparray != null) {
      for (var i = 0; i < tmparray.length; i++) {
        var reg = /[=|^==]/;    // 用=进行拆分，但不包括==
        var set1 = tmparray[i].replace(reg, '&');
        var tmpStr2 = set1.split('&');
        var array = new Array;
        array[tmpStr2[0]] = tmpStr2[1];
        paramsArray.push(array);
      }
    }
    // 将参数数组进行返回
    return paramsArray;
  },

  /**
   * 弹框
   */
  dig: dig.showDig,

  /**
   * 路由跳转
   */
  toRoute:route.toRoute,

  /**
   * 页面onload回调初始方法
   */
  callback: listenRoute.listenRoute,

  /**
   * 图片地址
   */
  imgurl: bizconsts.IMG_URL,

  /**
   * 定义分享页面及内容
   */
  shareContent(content, path, imageUrl){

    if (typeof content=='object'){
      return {
        title:content.title || "",
        path: content.path || "/pages/mainPackage/tabbar/index/index",
        imageUrl: content.imageUrl || "",
        success:content.success || null
      }
    }
    return {
      title: content || "通洗生活",
      path: path || "/pages/mainPackage/tabbar/index/index",
      imageUrl: imageUrl || ""
    }
  }
}

