// pages/mainPackage/user/userCoupon/addCoupon/addCoupon.js
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
    couponImg: imgurl +"delimg/add_coupon.jpg",
    mercInfo:{},
    ids:"",
    couponInfo:{},
    userInfo:{},
    received: null,
    otherList:[],
    pageSize: bizconsts.pageSz.PAGE_SIZE,
    total:"",
    textFlag: false,
    textErrFlag: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      let ids = getApp().hep.getScene("query").ids || options.ids;
      if (ids){
      this.setData({
        ids: getApp().hep.getScene("query").ids
      })
      this.data.mercInfo = storage.getMercInfo();
      this.obtainList();
      this.setData({
        mercInfo: this.data.mercInfo
      })
      this.queryOtherList()
    }else{
      getApp().hep.dig({
        type:"st",
        title:"非法参数",
        icon:"error"
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
  queryOtherList() {

    getApp().http({
      url:"coupon/obtain/queryOtherList",
      data: {
        ids: this.data.ids,
        pageSize:this.data.pageSize,
        startRow:this.data.otherList.length
      }
    }).then(res=>{
      this.data.otherList = this.data.otherList.concat(res.data.list);
    this.setData({
      otherList: this.data.otherList,
      total: res.data.total,
      loginFlag: true
    })
  })
  },
  obtainList() { // 查询领取优惠券列表
    getApp().http({
      url: "coupon/open/obtain/list",
      data: {ids:this.data.ids}
    }).then(res => {
      if(res.data.length){
      this.setData({
        couponInfo: res.data[0],
        loginFlag: true
      })
    }else{
      getApp().hep.dig({
        type: "st",
        title: "数据加载错误",
        icon: "error",
        loginFlag: false
      })
    }

  })
  },
  receive() { // 领取优惠券

    if(!this.data.userInfo.phone){
      if (storage.getUserInfo()){
        this.setData({
          userInfo: storage.getUserInfo()
        })
      }else{
        getApp().hep.dig({
          type: "st",
          title: "请重新扫码领取",
          icon: "error"
        })
        return;
      }
    }else{
      getApp().hep.dig({
        type: "st",
        title: "请勿重复领取",
        icon: "error"
      })
      return;
    }
    this.setData({
      otherList: [],
      loginFlag: false
    })
    getApp().http({
      url:"coupon/open/obtain/receive",
      data:{
        ids:this.data.ids,
        phone:this.data.userInfo.phone
      }
    }).then(res=>{

      if(res.data.length){
      this.queryReceivedList(res.data)
    } else {
      this.setData({
        textErrFlag: true,
        loginFlag:true
      })
    }

    this.queryOtherList();

  });
  },
  queryReceivedList(relids){
    getApp().http({
      url:"coupon/obtain/queryReceivedList",
      data:{
        relIds: relids
      }
    }).then(res=>{
      if(res.data.length){
      this.setData({
        received: res.data[0],
        "couponInfo.totalNum":this.data.couponInfo.totalNum+1,
        textFlag: true,
        loginFlag: true
      })
    }

  })
  },
  gotoIndex(){
    getApp().hep.toRoute("rech", "/pages/mainPackage/tabbar/index/index");
  }



})