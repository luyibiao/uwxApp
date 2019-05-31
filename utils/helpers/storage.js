const bizconsts=require("../../utils/variable/bizconsts.js");
const userInfo = bizconsts.storage.USER_INFO;
const coubordInfo = bizconsts.storage.COUBORD_INFO;
const mercInfo = bizconsts.storage.MERC_INFO;
const cityInfo = bizconsts.storage.CITY_INFO;
const shopInfo=bizconsts.storage.SHOP_INFO;

module.exports={
  setStorage:function(key,data){
    if (key){
       wx.setStorageSync(key,data)
     }
     else{
       return;
     }
  },
  getStorage:function(key){
    return key ? wx.getStorageSync(key) : "";
  },
  removeStorage:function(key){
    if(key){
      wx.removeStorageSync(key)
    }
    else{
      return;
    }
  },
  clearStorage:function(){
    wx.clearStorage();
  },

  /**
   * 设置用户信息缓存
   */
  setUserInfo:function(data){
    wx.setStorageSync(userInfo, data);
  },
  getUserInfo:function(){
    return wx.getStorageSync(userInfo);
  },

  /**
   * 设置商户信息
   */
  setMercInfo(data) {
    wx.setStorageSync(mercInfo, data);
  },
  getMercInfo: function () {
    return wx.getStorageSync(mercInfo);
  },

  /**
   * 设置城市信息
   */
  setCityInfo(data) {
    wx.setStorageSync(cityInfo, data);
  },
  getCityInfo: function () {
    return wx.getStorageSync(cityInfo);
  },

  /**
   * 设置商品信息
   */
  setShopInfo(data){
    wx.setStorageSync(shopInfo, data);
  },
  getShopInfo(){
    return wx.getStorageSync(shopInfo);
  },

  setShopInfoSync(data,fn){
    wx.setStorage({
      key:shopInfo,
      data:data,
      success(){
        if(fn && typeof fn=='function'){
          fn();
        }
      }
    })
  },

  
  setCoubordInfo:function(data){
    wx.setStorageSync(coubordInfo, data);
  },
  getCoubordInfo:function(){
    return wx.getStorageSync(coubordInfo);
  }
}