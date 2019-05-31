// pages/mainPackage/spread/settle/settle.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    headLoding: false,
    loading: false,
    balance:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.getBalance();
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
  getBalance(){
    getApp().http({
      url: "friendInfo/balance"
    }).then(res => {
      this.setData({
        balance: res.data.balance,
        headLoding: true
      })
    })
  },
  toWithdraw(){
    getApp().hep.toRoute("navgo","/pages/mainPackage/spread/withdraw/withdraw")
  }
  
})