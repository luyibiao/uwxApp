const methods=require("../../../../utils/helpers/methodser.js");
const mixins = require("../../../../utils/behaviors/mixins.js");
const createOrder=require("../../../../utils/behaviors/createOrder.js");
const storage=require("../../../../utils/helpers/storage.js");
const bizconsts = require("../../../../utils/variable/bizconsts.js"); 

Page({
  mixins: [createOrder],
  data: {
    vipPriceShow: 0,
    isVip: 0,
    shopList:[],
    start:{
      startTsWay:false
    },
    textArea:{
      showTextArea:false,
      userRemark:""
    },
    orderMode: bizconsts.orderMode,
    allMoney:0,
    vipAllMoney:0,
    wayMoney:"",
    wayType:"",
    popup:{
      showDetailPop:false,
      closeBitPoP: false,
      verifyPoP: false
    },
    userContent:"预约后请等待取送员上门取件，衣物到达门店或者洗涤中心检查衣物状况及确认洗涤价格。下单即表示您同意",
    subFormLoading: false
  },

 
  onLoad: function (options) {
    this.setData({
      vipPriceShow: storage.getMercInfo().isOpenVipPrice || 0
    })
   
  },

  onReady: function () {

  },

  
  onShow: function () {
    getApp().hep.callback(() => {
      this.setData({
        "start.startTsWay": true,
        orderMode: bizconsts.orderMode,
      })
      this.loadFn();
      methods.showUserProtocol()
      this.getShopList()
    }, this.route)
  },

  onHide(){
    this.setData({
      "start.startTsWay": false
    })
  },

  onTextArea(e){
    this.assignment(e.detail);
  },

  getShopList(){
    let moneyInfo = storage.getShopInfo().moneyInfo;
    this.setData({
      shopList: moneyInfo.proPriceDesc,
      allMoney: moneyInfo.disMoney,
      isVip: moneyInfo.isVip,
      vipAllMoney: moneyInfo.vipDisMoney
    })
    this.assignment(moneyInfo)
  },

  onTakeTimeFn(e){
    this.assignment(e.detail)
  },
  onTakeWayFn(e){
    
    this.setData({
      wayMoney: e.detail.wayMoney,
      wayType: e.detail.takeExpressType
    })
    this.assignment(e.detail)
  },

  shopPopDeail(){
    this.setData({
      "popup.showDetailPop": !this.data.popup.showDetailPop
    })
  },
  verify(e){
    
    if (this.data.wayType && this.data.wayType != "SELF"){
        this.setData({
          "popup.verifyPop" : true
        })
        return ;
    }
    this.subForm(e);
  },
  verifySubForm(e){
    this.setData({
      subFormLoading:true
    })
    this.subForm(e);
    this.setData({
      subFormLoading: false
    })
  },


  //自定义弹框框回调
  onPopup(e) {
    this.setData({
      'popup.showDetailPop': e.detail.popup
    })
   
  },
  closeVerifyPop(){
    this.setData({
      'popup.verifyPop': false
    })
  },
  //页面跳转
  toNavgoFn(e) {
    let url = getApp().hep.dataset(e, "url")
    getApp().hep.toRoute("navgo", url)
  }
})