// pages/tabbar/personal/personal.js
const filter = require("../../../../utils/helpers/filter.js");
const storage = require("../../../../utils/helpers/storage.js")
const methodser = require("../../../../utils/helpers/methodser.js")
const imgurl = getApp().hep.imgurl
const onlyCupboard = methodser.getConfigInfo("onlyCupboard");
const checkRoot = require("../../spread/utils/checkRoot.js");
const upayEnable = methodser.getConfigInfo("upayEnable");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      cardRightsArr:[],
      uPayCardBinding:'',
    },

    serviceIcon: `${imgurl}icon/online_service.png`,

    userHeadImg: imgurl + 'delimg/def.png',
    array:[
      [
        { name: "我的余额", img: imgurl + "icon/balance2.png", uri: "/pages/mainPackage/user/userMoney/userMoney", value: "", mode: "aspectFit", ishow: true, styleCss:'color:#FF8217; font-weight: 700;'},
        { name: "优惠券", img: imgurl + "icon/coupon2.png", uri: "/pages/mainPackage/user/userCoupon/userCoupon", value: "", mode: "aspectFit", ishow: true, styleCss: 'color:#FF8217; font-weight: 700;'},
        { name: "会员卡", img: imgurl + "icon/vip2.png", uri: "/pages/mainPackage/user/userCard/userCard", value: "", mode: "aspectFit", ishow: true, styleCss: 'color:#FF8217; font-weight: 700;'},
        { name: "优付卡", img: imgurl + "icon/ucard2.png", uri: "", value: "", mode: "aspectFit", ishow: upayEnable == 1, styleCss: 'color:#FF8217; font-weight: 700;'},
      ],
      [
        { name: "我的礼券", img: imgurl + "icon/my-coupon2.png", uri: "/pages/mainPackage/user/userShopCoupon/userShopCoupon", value: "", mode: "aspectFit", ishow: false},
        { name: "商城", img: imgurl + "icon/shop2.png", uri: "", value: "", mode: "aspectFit", ishow: false},
        { name: "友商中心", img: imgurl + "icon/spread2.png", uri: "/pages/mainPackage/spread/index/index", value: "", mode: "aspectFit", ishow: true},
      ],
      [
        { name: "地址管理", img: imgurl + "icon/address2.png", uri: "/pages/mainPackage/place/addressManage/addressManage", value: "", mode: "aspectFit", ishow: true},
        { name: "意见反馈", img: imgurl + "icon/feedback2.png", uri: "/pages/mainPackage/user/userFeedback/userFeedback", value: "", mode: "aspectFit", ishow: true},
        { name: "附近的智能柜", img: imgurl + "icon/nearby2.png", uri: "/pages/mainPackage/sys/nearbyCabinet/nearbyCabinet", value: "", mode: "aspectFit", ishow: onlyCupboard == 1 },
        { name: "联系客服", img: imgurl + "icon/online_service.png", uri: "/pages/mainPackage/user/contact/contact", value: "", mode: "aspectFit", ishow: true },
      ]
    
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  onShow(){
    getApp().hep.callback(() => {
      this.queryUserInfo();
      this.getCouponCount();
      wx.setNavigationBarTitle({
        title: storage.getMercInfo().name
      })
    }, this.route)
  },


  onHide: function () {

  },


  onUnload: function () {

  },

  queryUserInfo(){
    getApp().http({
      url: "userInfo/detail",
    }).then(res => {
      this.setData({
        userInfo: res.data,
        "userInfo.cardRightsArr": res.data.cardRights ? res.data.cardRights.split("") : [],
        "array[0][0].value": res.data.balance ? filter.amtFormat(res.data.balance) : 0.00,
        "array[0][2].value": res.data.isBinding == 1 ? '已绑定实体会员卡' : '',
        "array[0][3].value": res.data.uPayCardBalance ? filter.amtFormat(res.data.uPayCardBalance) : '',
        "array[0][3].uri": '/pages/mainPackage/user/userUCard/userUCard?uPayCardBinding=' + res.data.uPayCardBinding,
        "array[0][3].isShow": res.data.isUPay == 1,
        "array[1][0].isShow": res.data.isMall == 1,
        "array[1][1].isShow": res.data.isMall == 1,
        "array[1][2].isShow": res.data.isUserFriend || res.data.isFriend
      })
    })
  },
  getCouponCount(){
    getApp().http({
      url:"coupon/user/count"
    }).then(res=>{
      this.setData({
        "array[0][1].value": res.data ? res.data+'张' : '',
      })
      
    })
  },
  toNavgoFn(e){
    let url=getApp().hep.dataset(e,"url")
    getApp().hep.toRoute("navgo", url)
    // if (url.indexOf("plan/plan") > 0){
    //   checkRoot.getCompetence();
    // }else{
    //   getApp().hep.toRoute("navgo", url)
    // }
  },
  onCallPhone(){
    methodser.callPhone(this.data.userInfo.mercTel)
  },

})