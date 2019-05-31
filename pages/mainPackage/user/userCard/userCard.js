// pages/mainPackage/user/userCard/userCard.js
const storage = require("../../../../utils/helpers/storage.js")
const imgurl = getApp().hep.imgurl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardMsg:{
      userCard:{},
      discountType:'',
      couponList:[],
    },
    rightsList:[],
    showPrivilege: false,
    showNotes: false,
    mercInfo:{},
    cardStyle:'',
    qRcode:imgurl+'icon/QRcode.png',
    cardCoupon: imgurl +'icon/card-coupon.png',
    cardDiscount: imgurl +'icon/card-discount.png',
    cardIntegral: imgurl +'icon/card-integral.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.queryCardDetailFn();
      this.data.mercInfo = storage.getMercInfo();
      this.data.mercInfo.logoPath = this.data.mercInfo.logoPath ? this.data.mercInfo.logoPath : imgurl +'wxapp/delimg/def.png'
      this.setData({
        mercInfo: this.data.mercInfo
      })
     
      wx.setNavigationBarTitle({
        title: this.data.mercInfo.name,
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

  },
  // 该会员是否有当前特权
  hasRightsFn(i) {
    return this.rightsList[i] == '1'
  },
  showPrivilegeFn(){
    this.setData({
      showPrivilege: !this.data.showPrivilege
    })
  },
  queryCardStyle(){
    let sbg = this.data.cardMsg.userCard;
    this.data.cardStyle = sbg.coverType == 1 ? `background-color:${sbg.imgPath}` : `background:url(${sbg.imgPath}) center center/cover no-repeat;`
  },
  queryCardDetailFn(){
    getApp().http({
      url:"card/detail"
    }).then(res =>{
      res.data.discountDesc = res.data.discountDesc ? JSON.parse(res.data.discountDesc) : [];
      this.data.cardMsg = res.data;
      this.queryCardStyle();
      this.setData({
        cardMsg: this.data.cardMsg,
        rightsList: this.data.cardMsg.userCard ? this.data.cardMsg.userCard.rights.split("").splice(1) : [],
        cardStyle: this.data.cardStyle
      })
    })
  },
  showNotesFn(){
    this.setData({
      showNotes: !this.data.showNotes
    });
  },
  toUserCardProof(){
    getApp().hep.toRoute("navgo", "/pages/mainPackage/user/userCardProof/userCardProof")
  },
  toBindCard(){
    getApp().hep.toRoute("navgo", "/pages/mainPackage/user/userCard/bindCard/bindCard?cardFlag=1");
  }
})