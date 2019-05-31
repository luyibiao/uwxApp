// pages/mainPackage/user/userCard/bindCard/bindCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{
      rfidNo:'',
      checkCode:'',
      cardType: 11
    },
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // getApp().hep.callback(() => {
    //   if (!options.cardFlag || this.data.loading){
    //     getApp().hep.toRoute("swtab", "/pages/tabbar/personal/personal");
    //   }
      
    // }, this.route)
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
  addCardFn() {
    this.setData(
      {loading: true}
    )
    if (this.checkDataFn()) {
      getApp().http({
        url: "userInfo/rfid/binding",
        data: this.data.params,
        custom: true
      }).then(res => {
        if (res.httpCode == 200){
          
          this.setData({
            "params.checkCode": '',
            "params.rfidNo": ''
          })
          getApp().hep.dig({ type: "st", title: "绑定成功", url: '/pages/mainPackage/user/userCard/userCard', toType: 'reto'});
        }else{
          getApp().hep.dig({ type: "st", title: res.msg, icon: "error" });
          this.setData({
            loading: false
          })
        }
        
      })
    }

  },
  checkDataFn(e) { //校验数据
    let errorMsg = ""
    if (this.data.params.rfidNo.length == 0) {
      errorMsg = "卡号不能为空"
    }
    if (!errorMsg && this.data.params.checkCode.length == 0) {
      errorMsg = "验证码不能为空"
    }
    if (errorMsg) {
      getApp().hep.dig({ type: "st", title: errorMsg, icon: "error" });
      this.setData({
        loading: false
      })
      return false;
    }
    return true;
  },
  rfidNoInputFn(e) {//获取卡号
    let value = e.detail.value;
    this.data.params.rfidNo = value ? value.trim() : '';
  },
  checkCodeInputFn(e) {//获取验证码
    let value = e.detail.value;
    this.data.params.checkCode = value ? value.trim() : '';
  }
})