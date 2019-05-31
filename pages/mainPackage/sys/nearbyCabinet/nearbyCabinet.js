// pages/mainPackage/sys/nearbyCabinet/nearbyCabinet.js
const imgurl = getApp().hep.imgurl
const wc = require("../../../../utils/config/wxConfig.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: imgurl +'icon/u_icon-location.png',
    cabinetList:{},
    location: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(()=>{
      this.queryLocationFn();
    },this.route)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  queryLocationFn(){
    let _this = this;
    wc.getWxLocation((e)=>{
      _this.data.location = e.location
      _this.queryCabinetListFn();
    }).getAddress();
  },
  queryCabinetListFn(){
    if(this.data.location.lng && this.data.location.lat){
      getApp().hep.dig();
      getApp().http({
        url: "cupboard/near",
        data: this.data.location
      }).then(res => {
        for (let item in res.data) {
          if (res.data[item].distance >= 1) {
            res.data[item].distance = res.data[item].distance.toFixed(2)
          } else {
            res.data[item].distance = res.data[item].distance.toFixed(3)
          }
        }

        this.setData({
          cabinetList: res.data
        })
        wx.hideLoading();

      })
    }
    
  }
})