// pages/mainPackage/user/userUCard/userUCard.js

const storage = require("../../../../utils/helpers/storage.js")
const wxbarcode = require("../../../../utils/view/wxbarcode.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rfidNoPlaceholder:"请输入卡号",
    checkCodePlaceholder:"请输入卡背面验证码",
    loading: false,
    plain: false,
    isAddFlag: false,
    bindOrUcard:'bind',
    detail:{},
    params:{
      cardType: 41,
      rfidNo: "",
      checkCode: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.bindOrUcard = options.uPayCardBinding == 1 ? "ucard" : 'bind';
    this.setData({
      bindOrUcard: this.data.bindOrUcard
    })

    if(options.uPayCardBinding){
      this.queryUPayCard();
    }
    wx.setNavigationBarTitle({
      title: options.uPayCardBinding ? storage.getMercInfo().name : "绑定优付卡"
    })
    
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
  queryUPayCard(){
    getApp().http({
      url: "card/uPayCard"
    }).then(res =>{
      wxbarcode.qrcode('qrcode', res.data.cardNo, 311, 311);
      wxbarcode.barcode('barcode', res.data.cardNo, 488, 130);
      this.setData({
        detail: res.data || {}
      });
    })
  },
  addUcardFn(){
    if(this.checkDataFn()){
      getApp().http({
        url: "userInfo/rfid/binding",
        data: this.data.params
      }).then(res => {
        this.setData({
          "params.checkCode": '',
          "params.rfidNo": '',
          bindOrUcard:'ucard'
        });
        this.queryUPayCard();

      })
    }
   
  },
  checkDataFn(e){ //校验数据
    let errorMsg = ""
    if (this.data.params.rfidNo.length == 0) {
      errorMsg = "卡号不能为空"
    }
    if (!errorMsg && this.data.params.checkCode.length == 0 ){
      errorMsg = "验证码不能为空"
    }
    if(errorMsg){
      getApp().hep.dig({ type: "st", title: errorMsg, icon: "error" });
      return false;
    }
    return true;
  },
  rfidNoInputFn(e){//获取卡号
    let value = e.detail.value;
    this.data.params.rfidNo = value ? value.trim() : '';
  },
  checkCodeInputFn(e){//获取验证码
    let value = e.detail.value;
    this.data.params.checkCode = value ? value.trim() : '';
  }
})