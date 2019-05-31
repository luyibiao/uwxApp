// pages/mainPackage/spread/index/index.js
const imgurl = getApp().hep.imgurl ;
const checkRoot=require("../utils/checkRoot.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spread:{},
    headImg: imgurl +'delimg/def.png',
    loding: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => { 
      checkRoot.getCompetence(()=>{
        this.getSpreadFn()
      });
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
    return getApp().hep.shareContent()
  },
  getSpreadFn(){
    getApp().hep.dig();
    getApp().http({
      url:"friendInfo/income"
    }).then(res =>{
      this.setData({
        spread: res.data, 
        loding: true
      })
      getApp().hep.dig({type:'hl'});
     

    })
  },
  openPoster(){
    getApp().hep.toRoute("navgo", "/pages/mainPackage/spread/posterExpand/posterExpand?spreadCode=" + this.data.spread.spreadCode)
  },
  openInvite(){
    getApp().hep.toRoute("navgo", "/pages/mainPackage/spread/invite/invite?spreadCode=" + this.data.spread.spreadCode)
  }
})