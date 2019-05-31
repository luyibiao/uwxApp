const storage = require("../../../../utils/helpers/storage.js");
const bizconsts = require("../../../../utils/variable/bizconsts.js");
Page({

  data: {
    params:{},
    content:"",
    coubord:""
  },

  onLoad: function (options) {
    // this.data.params = storage.getCoubordInfo(); 
    this.setData({
      params: storage.getCoubordInfo(),
      coubord: bizconsts.coubord
    })
    this.setContent();
},

  onReady: function () {},


  onShow: function () {},

  onHide: function () {},

  onShareAppMessage: function () {},

  setContent:function(){
    let str = ""
    if (this.data.params.optway == bizconsts.coubord.ORDER) {
      str = "下单"
    }
    else if (this.data.params.optway == bizconsts.coubord.CLOTHING) {
      str = "取衣"
    }
    else if (this.data.params.optway == bizconsts.coubord.CLOAK) {
      str = "存衣"
    }
    this.setData({
      content:str
    })
    wx.setNavigationBarTitle({
      title: `${str}成功`,
    })
  },
  onBackIndex(){
    getApp().hep.toRoute("swtab","/pages/mainPackage/tabbar/index/index")
    this.clearStorage();
  },
  onFindOrder(){
    getApp().hep.toRoute("reto", "/pages/mainPackage/creationOrder/orderDetail/orderDetail?id=" + storage.getCoubordInfo().orderId);
    this.clearStorage();
  },

  clearStorage(){
    storage.removeStorage(bizconsts.storage.COUBORD_INFO)
  }
})