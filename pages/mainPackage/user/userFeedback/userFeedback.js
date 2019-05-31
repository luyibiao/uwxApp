// pages/mainPackage/user/userFeedback/userFeedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"",
    textSize: 0,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  updateSizeFn(e){
    this.data.content = e.detail.value;
    this.setData({
      textSize: e.detail.value.length
    })
  },
  onFeedback(){
    this.setData({
      loading:true
    })
    if (!this.data.content){
      getApp().hep.dig({type:"st", title:"请填写反馈内容",icon:"error"})
      this.setData({
        loading:false
      })
      return;
    }
    getApp().http({
      url: "feedback/add",
      data:{
        content: this.data.content
      }
    }).then(res =>{
      getApp().hep.dig({ type: "st", title: "提交成功", url: "/pages/mainPackage/tabbar/personal/personal", toType: "swtab"})
    })
  }
})