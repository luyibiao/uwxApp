const storage=require("../../../../utils/helpers/storage.js")
const methods=require("../../../../utils/helpers/methodser.js");
const bizconsts=require("../../../../utils/variable/bizconsts.js");
Page({

  data: {
    vipPriceShow: 0,
    isVip: 0,
    vipAllMoney: 0,
    userContent: "预约成功后，开柜码两小时内有效，查看并同意",
    form:{
      business: "",
      proPriceDesc: "",
      payablePrice: "",
      cupboardId: "",
      userRemark: "",
      createCnt: 1, //衣物数量
    },
    shopList:[],
    cupboradFlag:false,
    btnStatus:false,
    closeBitPoP: false,
    closedTip:"",
    orderMode: ""
  },

  onLoad: function (options) {
    getApp().hep.callback(()=>{
      this.loadFn();
      methods.showUserProtocol()
    },this.route)
  },


  onShow: function () {
    this.setData({
      cupboradFlag: true
    })
  },
  onHide(){
    this.setData({
      cupboradFlag:false
    })
  },

  
  loadFn(){
    this.setData({
      vipPriceShow: storage.getMercInfo().isOpenVipPrice || 0,
      btnStatus:methods.getConfigInfo("createOrderEnable") ? false : true,
      closedTip: methods.getConfigInfo("closedTip") || "预约已满，请改日下单",
      orderMode: bizconsts.orderMode
    })
    if (this.data.orderMode.CURRENT_MODE != this.data.orderMode.ROOR_MODE && storage.getShopInfo()){
      let shopInfo = storage.getShopInfo().moneyInfo
      this.setData({
        shopList: shopInfo.proPriceDesc,
        "form.payablePrice": shopInfo.disMoney,
        "form.business": methods.getBussinessList().business,
        "form.proPriceDesc": methods.getBussinessList().proPriceDesc,
        vipAllMoney: shopInfo.vipDisMoney,
        isVip: shopInfo.isVip
      })
    }
    else{
     
    }
  },

  onSubmit(){
    if (this.data.btnStatus) {
      this.setData({
        closeBitPoP: true
      })
      return;
    }

   if(!this.data.form.cupboardId){
     getApp().hep.dig({
       type:"st",
       title:"请选择智柜",
       icon: "error"
     })
     return;
   }
    getApp().hep.dig();
    getApp().http({
      url:'order/cupboard/bookAdd',
      data:this.data.form
    }).then(res=>{
      wx.hideLoading();
      if (methods.checkAddressOrTs(res, bizconsts.TS_WAY.TS_SELF)){
        getApp().hep.dig({
          type: 'st',
          title: "下单成功",
          url: "/pages/mainPackage/tabbar/order/order",
          toType: "swtab"
        })
      }
    })
  },

  //得到智柜id
  onCouboardInfo(e) {
    this.data.form.cupboardId = e.detail.id;
  },

  //得到备注信息
  onTextArea(e) {
    this.data.form.userRemark = e.detail.userRemark;
  },

  //得到衣物信息
  onSelectClothNum(e) {
    this.data.form.createCnt = e.detail.createCnt
  },
  closePop() {
    this.setData({
      closeBitPoP: false
    })
  }
  
})