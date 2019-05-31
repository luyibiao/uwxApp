// pages/mainPackage/user/userCardProof/userCardProof.js
const imgurl = getApp().hep.imgurl
const storage = require("../../../../utils/helpers/storage.js")
const wxbarcode = require("../../../../utils/view/wxbarcode.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mercInfo:{},
    cardMsg:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.queryCardDetailFn();
      this.data.mercInfo = storage.getMercInfo();
      
      this.data.mercInfo.logoPath = this.data.mercInfo.logoPath ? this.data.mercInfo.logoPath : imgurl + 'wxapp/delimg/def.png'
      this.setData({
        mercInfo: this.data.mercInfo
      })
    }, this.route)
    
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
  queryCardDetailFn() {
    getApp().http({
      url: "/card/detail"
    }).then(res => {
      // res.data.discountDesc = res.data.discountDesc ? JSON.parse(res.data.discountDesc) : [];
      this.data.cardMsg = res.data;
      wxbarcode.qrcode('qrcode', this.data.cardMsg.cardNo, 360, 360);
      this.setData({
        cardMsg: this.data.cardMsg,
      })
    })
  }
})