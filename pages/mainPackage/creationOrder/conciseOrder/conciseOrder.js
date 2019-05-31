const storage=require("../../../../utils/helpers/storage.js");
const methods=require("../../../../utils/helpers/methodser.js");
const createOrder = require("../../../../utils/behaviors/createOrder.js");
const mixins = require("../../../../utils/behaviors/mixins.js");
Page({
  mixins: [createOrder],
  data: {
    userContent:"预约后请等待取送员上门取件，衣物到达门店或者洗涤中心检查衣物状况及确认洗涤价格。下单即表示您同意",
    start:{
      startTsWay:false
    },
    verifyPop: false,
    subFormLoading: false,
    form:{
      mode: 3, //下单模式-简洁预约模式
      createCnt: 1, //衣物数量
      hasBig: 0, //是否有大件
      serviceTimeId: "",
      takeAddressId: "",
      takeDate: "",
      takeTimeEnd: "",
      takeTimeStart: "",
      userRemark: "",
      takeExpressType: ''
    },
    hasBigList: [{ name: "无" }, { name: "有"}],
    hasbigCurrent:0
  },

  onLoad: function (options) {
  },

  onReady: function () {

  },

  onShow: function () {
    getApp().hep.callback(() => {
      this.setData({
        "start.startTsWay": true,
      })
      this.loadFn();
      methods.showUserProtocol()
    }, this.route)
  },

  onHide: function () {
    this.setData({
      "start.startTsWay": false,
     
    })
  },

  onUnload: function () {

  },

  onTakeTimeFn(e){
    this.assignment(e.detail)
  },

  onTakeWayFn(e){
    this.assignment(e.detail)
  },

  onSelectClothNum(e){
    this.assignment(e.detail)
  },
  onTextArea(e) {
    this.assignment(e.detail);
  },

  assignment(data) {
    let form = this.data.form;
    for (let i in data) {
      for (let j in form) {
        if (i === j) {
          form[j] = data[i];
        }
      }
    }
    this.data.form = { ...form }
  },
  onSelectBig(e){
    let index=getApp().hep.dataset(e,"index");
    this.setData({
      hasbigCurrent:index,
      "form.hasBig":index
    })
  },

  verify(e) {

    if (this.data.disabledCreate) {
      this.setData({
        closeBitPoP: true
      })
      return;
    }

    if (!this.data.form.serviceTimeId) {
      this.showDig("选择取件时间", "error");
      return;
    }
    if (!this.data.form.takeExpressType) {
      this.showDig("选择取件方式", "error");
      return;
    }

    if (this.data.form.takeExpressType != "SELF") {
      this.setData({
        verifyPop: true
      })
      return;
    }
    this.onSubmit(e);
  },

  onSubmit(){
    let shopInfo = storage.getShopInfo();
    this.data.form.takeAddressId = shopInfo['moneyInfo'].orderAddres.id;
    getApp().hep.dig();
    getApp().http({
      url:"order/add",
      data:this.data.form,
    }).then(res=>{
      wx.hideLoading();
      if (methods.checkAddressOrTs(res, this.data.form.takeExpressType)) {
        this.showDig("下单成功", "", "/pages/mainPackage/tabbar/order/order", "swtab")
      }
    })
  },

  showDig(title, icon, url, toType){
    getApp().hep.dig({
      type:"st",
      title:title,
      icon:icon,
      url:url,
      toType: toType
    })
  },
  closeVerifyPop(){
    this.setData({
      verifyPop:false
    })
  }
})