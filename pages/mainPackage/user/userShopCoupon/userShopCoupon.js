// pages/mainPackage/user/userShopCoupon/userShopCoupon.js
const imgurl = getApp().hep.imgurl + "icon"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: imgurl +"/balance.png",
    couponList: [],
    popFlag: false,
    params:{
      code:''
    },
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.queryCouponList();
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
  //弹出框回调
  onPopup(e) {
    this.data.popFlag = e.detail.popup
    this.setData({
      popFlag: false,
      "params.code": '',
      "params.secret": ''
    })
  },
  //请求列表
  queryCouponList(){
    getApp().http({
      url:"coupon/user/goods"
    }).then(res =>{
      this.setData({
        couponList: res.data,
      })
    })
  },
  //pop展示
  showPopupFn(){
    this.setData({
      popFlag: true,
      loading: false
    })
  },
  checkCodeInputFn(e){
    let code = e.detail.value;
    this.data.params.code = code;
  },
  checkSecretInputFn(e){
    let secret = e.detail.value;
    this.data.params.secret = secret;
  },
  //兑换
  exchangeFn(){
    if(this.checkParams()){
      this.setData({
        loading: true
      });
      getApp().http({
        url: "couponFCode/exchange",
        data: this.data.params,
        custom: true
      }).then(res => {
        if(res.httpCode == 200){
          getApp().hep.dig({ type: "st", title: "兑换成功" });
          this.setData({
            popFlag: false,
            "params.code": '',
            "params.secret": ''
          })
          this.queryCouponList();
        }else{
          getApp().hep.dig({ type: "st", title: res.msg, icon: "error"});
        }
       this.setData({
         loading: false
       })
      })
    }
   
  },
  checkParams(){
    var errorMsg ='';
    if(!this.data.params.code){
      errorMsg = "请输入券号";
    }
    if (!errorMsg && !this.data.params.secret){
      errorMsg = "请输入秘钥"
    }
    if (errorMsg){
      getApp().hep.dig({ type: "st", title: errorMsg, icon: "error" });      
      return false;
    }
    return true;
  }

})