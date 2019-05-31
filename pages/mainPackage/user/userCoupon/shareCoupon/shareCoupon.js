// pages/mainPackage/user/userCoupon/shareCoupon/shareCoupon.js
const imgurl = getApp().hep.imgurl
const md5 = require("../../../../../utils/helpers/md5.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon:{},
    loding:false,
    details:[],
    imgPath:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      let coupon = JSON.parse(options.coupon)
      this.setData({
        coupon: JSON.parse(options.coupon)
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
    let checkCode = md5.MD5(this.data.coupon.createTime);
    return getApp().hep.shareContent('送你一张优惠券，赶快领取使用吧！', 
      `/pages/mainPackage/user/userCoupon/addShareCoupon/addShareCoupon?ids=${this.data.coupon.id}&checkCode=${checkCode}`,
     `${imgurl}bdimg/share_content-log.png`)
  },
  toIndex(){
    getApp().hep.toRoute("rech", "/pages/mainPackage/tabbar/index/index")
  },
  toUserCoupon(){
    getApp().hep.toRoute("navback", "pages/mainPackage/user/userCoupon/userCoupon")
  },
  queryDetail(){
    getApp().http().then(res=>{
      
    })
  }
})