const storage=require("../helpers/storage.js");
const mutations=require("../helpers/mutations.js")
const methods=require("../helpers/methodser.js");
const bizconsts=require("../variable/bizconsts.js")
module.exports = {
  data:{
    form:{
      takeAddressId: "", //取件地址id
      serviceTimeId: "", //取件时间id        
      takeTimeStart: "", //取件起始时间
      takeTimeEnd: "", //取件结束时间
      takeDate: "", //取件日期(默认当天)
      business: [], //经营大类[{i:'id';n:'name'}]
      proPriceDesc: [], // 下单衣物列表[{i:'id',n:'name',c:'cnt',p:'imgpath'}]
      takeExpressType: '',
      userRemark: "", //留言    
    },
    disabledCreate:false,
    closeBitPoP: false,
    closedTip:""
    
  },
  loadFn() {
    this.initCongfig();
  },
  initCongfig(){
    
    // if (!storage.getStorage('showProtocol')){
    //   getApp().hep.toRoute("navgo","/pages/mainPackage/user/userProtocol/userProtocol")
    //   storage.setStorage('showProtocol',1)
    //   return;
    // }
    this.setData({
      disabledCreate: methods.getConfigInfo("createOrderEnable") ? false : true,
      closedTip: methods.getConfigInfo("closedTip") || "预约已满，请改日下单"
    })  
  },
  subForm(){
    if(this.data.disabledCreate){
      this.setData({
        closeBitPoP:true
      })
      return ;
    }

    if (!this.data.form.serviceTimeId){
      this.showdig("st", "请选择取件时间","error")
      return;
    }
    if (!this.data.form.takeExpressType){
      this.showdig("st", "请选择取件方式", "error")
      return;
    }
    let shopInfo = storage.getShopInfo();
    this.data.form.takeAddressId = shopInfo['moneyInfo'].orderAddres ? shopInfo['moneyInfo'].orderAddres.id : 0;
    if (!this.data.form.takeAddressId) {
      this.showdig("st", "请填写取件地址", "error")
      return;
    }

    if (bizconsts.orderMode.CURRENT_MODE == bizconsts.orderMode.PAY_MODE) {
      this.data.form["payablePrice"] = shopInfo.moneyInfo.disMoney
    }

    if (typeof this.data.form.business != 'string' || typeof this.data.form.proPriceDesc !='string'){
      this.formatlist();
    }
    getApp().http({
      url:"order/add",
      data:this.data.form
    }).then(res=>{
      let _this=this
      if (methods.checkAddressOrTs(res,this.data.form.takeExpressType)){
       this.showdig("st", "下单成功", "", () => {
           if (bizconsts.orderMode.CURRENT_MODE == bizconsts.orderMode.BESPOKE_MODE) { //预约模式
             getApp().hep.toRoute('swtab', "/pages/mainPackage/tabbar/order/order")
           }
           if (bizconsts.orderMode.CURRENT_MODE == bizconsts.orderMode.PAY_MODE) { //下单支付模式
             let resid=res.data
             getApp().hep.toRoute('reto', "/pages/mainPackage/creationOrder/orderTrade/orderTrade?id=" + resid)
           }
       })
     }
    })
  },

  
  formatlist(){
    this.data.form.business = JSON.stringify(this.data.form.business);
    this.data.form.proPriceDesc = JSON.stringify(this.data.form.proPriceDesc)
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
  //弹框提示
  showdig(type,title,icon,fn){
    getApp().hep.dig({
      type:type,
      title:title,
      icon:icon,
      success(){
        if(fn && typeof fn=='function'){
          setTimeout(function(){
            fn();
          },1500)
          
        }
      },
    })
  },
  closePop(){
    this.setData({
      closeBitPoP: false
    })
  }
}