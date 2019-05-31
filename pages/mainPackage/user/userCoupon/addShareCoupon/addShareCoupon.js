const imgurl = getApp().hep.imgurl
const storage = require("../../../../../utils/helpers/storage.js")
const bizconsts = require("../../../../../utils/variable/bizconsts.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginFlag: false,
    userHeadImg: imgurl + 'delimg/def.png',
    couponImg: imgurl + "delimg/add_coupon.jpg",
    mercInfo: {},
    ids: "",
    couponInfo: {},
    userInfo: {},
    received: null,
    textFlag: false,
    textErrFlag: false,
    firstFlag: true,
    checkCode: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      if (getApp().hep.getScene("query").ids) {
        this.setData({
          ids: getApp().hep.getScene("query").ids,
          checkCode: getApp().hep.getScene("query").checkCode || ''
        })
        this.data.mercInfo = storage.getMercInfo();
        if (this.data.checkCode.length){//拥有code是用户转赠优惠券， 无code是订单完成分享优惠券
          this.donateDetail();
        }else{
          this.obtainList();
        }
        this.setData({
          mercInfo: this.data.mercInfo
        })
      } else {
        getApp().hep.dig({
          type: "st",
          title: "非法分享券",
          icon: "error"
        })
      }


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
  onShow: function (e) {
    console.log(e, "addShareCoupon")
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
  obtainList() { // 查询领取优惠券列表
    getApp().http({
      url: "coupon/open/obtain/share",
      data: { ids: this.data.ids },
      custom: true
    }).then(res => {
      if (res.httpCode == 200){
        if (res.data.length) {
          this.setData({
            couponInfo: res.data[0],
            loginFlag: true
          })
        } else {
          getApp().hep.dig({
            type: "st",
            title: "数据加载错误",
            icon: "error",
          })
          this.setData({
            loginFlag: false
          })
        }
      }else{
        this.setData({
          textErrFlag: true,
          loginFlag: true,
          firstFlag:false

        })
      }
      

    })
  },
  donateDetail(){
    getApp().http({
      url: "coupon/open/obtain/donate",
      data: { 
        ids: this.data.ids,
        checkCode: this.data.checkCode,    
      },
      custom: true
    }).then(res => {
      if (res.httpCode == 200) {
        if (res.data){
          this.setData({
            couponInfo: res.data,
            loginFlag: true
          })
        }else{
          getApp().hep.dig({
            type: "st",
            title: "数据加载错误",
            icon: "error",
            
          })
          this.setData({
            loginFlag: false
          })
        }
      }else{
        this.setData({
          textErrFlag: true,
          loginFlag: true,
          firstFlag: false
        })
      }
    });
  },
  receive() { // 领取优惠券
    if (storage.getUserInfo()) {
      this.setData({
        userInfo: storage.getUserInfo(),
        firstFlag: false
      })
    } else {
      getApp().hep.dig({
        type: "st",
        title: "请重新扫码领取",
        icon: "error"
      })
      return;
    }
    this.setData({
      loginFlag: false
    })
    getApp().http({
      url: this.data.checkCode.length ? 'coupon/open/obtain/receiveShare' : "coupon/open/obtain/receive",
      data: {
        ids: this.data.ids,
        phone: this.data.userInfo.phone,
        checkCode: this.data.checkCode
      },
      custom: true
    }).then(res => {
      if (res.httpCode == 200){
        if ((res.data && res.data.length) || this.data.checkCode.length) {
          this.queryReceivedList(res.data)
        } else {
          this.setData({
            textErrFlag: true,
            loginFlag: true
          })
        }
      }else{
        this.setData({
          textErrFlag: true,
          loginFlag: true
        })
      }
      
    });
  },
  queryReceivedList(relids) {
    getApp().http({
      url: "coupon/obtain/queryReceivedList",
      data: {
        relIds: this.data.checkCode.length ? this.data.ids : relids
      }
    }).then(res => {
      if (res.data.length) {
        this.setData({
          received: res.data[0],
          
          textFlag: true,
          loginFlag: true
        })
      }

    })
  },
  gotoIndex() {
    getApp().hep.toRoute("rech", "/pages/mainPackage/tabbar/index/index");
  }



})