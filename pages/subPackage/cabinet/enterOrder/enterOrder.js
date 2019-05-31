
const storage=require("../../../../utils/helpers/storage.js");
const methodser = require("../../../../utils/helpers/methodser.js");
const bizconsts=require("../../../../utils/variable/bizconsts.js");
Page({
  data: {
    tel: "",
    params:{},
    timer:null,
  },

  onLoad: function (options) {
    let _this=this;
    this.data.params = storage.getCoubordInfo(); 
    this.setData({
      tel: bizconsts.SERVICE_TEL,
      params: this.data.params,
    })
    this.setTabbar();
    this.data.timer = setInterval(function () {
      _this.cupboardDoorCode();
    }, 3000)
  },

  onUnload(){
    clearInterval(this.data.timer)
  },

  makePhoneCall() {
    methodser.callPhone(this.data.tel);
  },

  //已关好箱门
  alreadyClose(){
    getApp().hep.dig();
    getApp().http({
      url:"cupboardBox/closeConfirm",
      data:{
        cupboardCode: this.data.params.code,
        cupboardDoorCode: this.data.params.cupboardDoor
      }
    }).then(res=>{
      this.routeGo();
    })
  },

  //重开箱门
  onAgainOpen(){
    getApp().http({
      url:'order/cupboard/reopen',
      data:{
        orderId: this.data.params.orderId,
        cupboardCode: this.data.params.code
      }
    }).then(res=>{
      this.routeGo();
    })
  },

  //查询开箱门数
 
  cupboardDoorCode(){
    getApp().http({
      url: "cupboardBox/queryOpenCount",
      data:{
        cupboardCode: this.data.params.code,
        cupboardDoorCode: this.data.params.cupboardDoor
      }
    }).then(res=>{
      if (res.data.count===0){
          this.routeGo();
      }
      
    })
  },

  //跳转
  routeGo(){
    getApp().hep.toRoute("rech", "../orderSuccess/orderSuccess")
  },

  //设置头部导航文字
  setTabbar(){
    let str=""
    if (this.data.params.optway == bizconsts.coubord.ORDER){
      str="下单"
    }
    else if (this.data.params.optway == bizconsts.coubord.CLOTHING){
      str="取衣"
    }
    else if (this.data.params.optway == bizconsts.coubord.CLOAK){
      str="存衣"
    }
    wx.setNavigationBarTitle({
      title:str,
    })
  },
})