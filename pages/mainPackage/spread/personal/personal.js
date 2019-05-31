// pages/mainPackage/spread/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headLoding: false,
    commission:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.getCommissionFn()

    },this.route);
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
  // 获取个人推广详情
  getCommissionFn() {
    getApp().hep.dig();
    getApp().http({
      url: "friendInfo/profit"
    }).then(res => {
      this.setData({
        commission : res.data,
        headLoding: true
      })
      getApp().hep.dig({type:"hl"})
    })
  }
})