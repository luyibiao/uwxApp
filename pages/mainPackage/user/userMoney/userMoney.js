// pages/mainPackage/user/userMoney/userMoney.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:0,
    loading:false,
    plain:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.queryBalance();
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
  /** 查询余额**/
  queryBalance() {
    getApp().http({
      url: "userExt/queryBalance",
    }).then(res => {
      this.setData({
        balance: res.data.balance,
      })
    })
  },
  //页面跳转
  toNavgoFn(e){
    let url = getApp().hep.dataset(e, "url")
    getApp().hep.toRoute("navgo", url)
  }
})