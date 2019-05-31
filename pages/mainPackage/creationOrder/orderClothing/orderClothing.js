// pages/mainPackage/creationOrder/orderClothing/orderClothing.js
Page({

  data: {
    list:[]
  },

  onLoad: function (options) {
    getApp().hep.callback(()=>{
      this.getImgList(options.orderId);
    },this.route)
  },

  onShow: function () {

  },

  onShareAppMessage: function () {

    return getApp().hep.shareContent()
  },

  //获取衣物照片
  getImgList(orderId){
    getApp().hep.dig();

    getApp().http({
      url:"orderProductRelImg/list",
      data: { orderId}
    }).then(res=>{
      this.setData({
        list: res.data
      })
      wx.hideLoading()
    })
  },

  //查看衣物照片
  onFindImg(e){
    let _this=this;
    let list=[];
    let imgurl = getApp().hep.dataset(e,"imgurl");
    _this.data.list.forEach((item)=>{
      list.push(item.cameraImg)
    })
    wx.previewImage({
      current: imgurl,
      urls: list 
    })
  }
})