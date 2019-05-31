// pages/mainPackage/user/userCoupon/userCoupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList:[],
    validCouponList: [],
    show: {
      valid: true
    },
    popFlag: false,
    popHeadName:'',
    popInputPla:'',
    code:'',
    loading: false,
    buttonName:'',
    codeOrCoupon:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.queryConpon();
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
      popFlag: false
    })
  },
  showPopupFn(e){
    let codeOrCoupon = getApp().hep.dataset(e,"params");
    this.data.codeOrCoupon = codeOrCoupon;
    this.setData({
      loading: false,
      code:'',
      popFlag:true,
      popInputPla: codeOrCoupon == 'code' ? "输入优惠码" : "输入礼包秘钥",
      popHeadName: codeOrCoupon == 'code' ? "兑换优惠码" : "兑换优惠券礼包",
      buttonName: codeOrCoupon == 'code' ? "优惠码兑换" : "秘钥兑换"
    })
  },

  queryConpon(){
    this.setData({
      couponList : []
    })
    getApp().http({
      url:"coupon/user/list"
    }).then(res => {
      let list = res.data;
    for(let index in list){
      if (list[index].isValid) {
        this.data.couponList.push(list[index])
      } else {
        this.data.validCouponList.push(list[index])
      }
    }
    this.setData({
      couponList: this.data.couponList,
      validCouponList: this.data.validCouponList
    })
  })
  },
  onShowValidFn(){
    this.setData({
      "show.valid": !this.data.show.valid
    })
  },
  exchangeFn(){
    let flag = this.data.codeOrCoupon == 'code';
    if (!this.data.code){
      getApp().hep.dig({ type: "st", title: flag ? "请输入优惠码" : "请输入礼包秘钥", icon: "error" });
      return ;
    }
    this.setData({
      loading: true
    })
    getApp().http({
      url: flag ? "couponFCode/exchangeCode" : "gift/receive",
      data:{
        secret: flag ? "" : this.data.code,
        code: flag ? this.data.code : ''
      },
      custom:true
    }).then(res =>{
      if (res.httpCode == 200){
      getApp().hep.dig({ type: "st", title: "兑换成功" });
      this.setData({
        popFlag: false,
        "show.valid": true,
      })
      this.queryConpon();
    }else{
      getApp().hep.dig({ type: "st", title: res.msg, icon: "error" });
    }
    this.setData({
      loading: false
    })

  })

  },
  checkCodeInputFn(e){
    let value = e.detail.value;
    this.data.code = value.trim();
  },
  openCoupon(e){
    let data = getApp().hep.dataset(e,"item");
    let json = JSON.stringify(data)
    getApp().hep.toRoute("navgo", "/pages/mainPackage/user/userCoupon/shareCoupon/shareCoupon?coupon="+json)
  }
})