const calculation=require("../../../../utils/helpers/calculation.js");
const watch=require("../../../../utils/view/watch.js")
const filter=require("../../../../utils/helpers/filter.js");
const downTimer=require("../../../../utils/view/wxTimer.js")
const wc=require("../../../../utils/config/wxConfig.js");
Page({

  data: {
    balance:false,//余额支付开关,
    id:"",
    payInfo:{},
    nowtime:"",
    discountAmount:"", //优惠券
    type:0 , //类型
    allBalance:0,//余额
    sysAmount:"" , //系统金额
    payMode:"", //支付文字提示
    showpPopup:false,
    couponList:[],
    couactive:0,
    useBalance:true,
    wxTimerList: {},
    payEffective: true, //是否在支付有效期内
    btnStatus:false
  },

  onLoad: function (options) {
    getApp().hep.callback(()=>{
      this.data.id=options.id;
      watch.setWatch(this,this.watch)
      this.queryPayInfo()
     
    },this.route)
  },
  watch:{
    type(){     
      wx.nextTick(()=>{
        this.initDiscountAmount();
      })
    },
    discountAmount(){
      wx.nextTick(()=>{
        this.initSysAmount();
      })
      
    },
    sysAmount(){
      wx.nextTick(()=>{
        this.initPayMode();
      })
      
    },
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  initDiscountAmount(){
    if(this.data.payInfo){
      if (this.data.type === 2 &&
        this.data.payInfo.uPayCard &&
        this.data.payInfo.uPayCard.isEnable &&
        !this.data.payInfo.uPayCard.useCoupon){
          this.setData({
            discountAmount:0
          })
          return;
        }
     
        else{
          
          this.setData({
            discountAmount: this.data.couactive ?  (this.data.payInfo.couponAmt || 0) : 0
          })
          return;
        }
    }
    this.setData({
      discountAmount: 0
    })
  },

  getAllBalance(){
    getApp().http({
      url:'userExt/balance',
      data:{}
    }).then(res=>{
      this.setData({
        allBalance: res.data.balance
      })
      if(this.data.allBalance>0){
        this.selectedPayType(1);
      }
    })
  },

  // 系统金额
  initSysAmount(){
    if (this.data.payInfo) {
      let paymentPrice = this.data.payInfo.payablePrice - this.data.discountAmount;
     
      if (paymentPrice < 0) {
        paymentPrice = 0;
      }
      if (this.data.type ==1) {
        // 余额
        this.setData({
          sysAmount: paymentPrice > this.data.allBalance ? this.data.allBalance : paymentPrice
        })
        return;
      } else if (this.data.type == 2) {
        // 优付卡
        let price = calculation.accDiv(
          (paymentPrice) *
          this.data.payInfo.uPayCard.payRatio,
          100
        );
        this.setData({
          sysAmount: price > this.data.payInfo.uPayCard.balance
            ? this.data.payInfo.uPayCard.balance
            : price
        })
        return ;
      }
      this.setData({
        sysAmount:0
      })
      return;
    }
    this.setData({
      sysAmount: 0
    })
    return;
  },

  queryPayInfo(){
    getApp().http({
      url:'order/payInfo',
      data:{id:this.data.id}
    }).then(res=>{
      this.setData({
        payInfo:res.data || null,
        nowtime: res.timestamp
      })
      
      this.getcoupopnList();
      this.startTime();
     
    })
  },

  getcoupopnList(){
    getApp().http({
      url:"coupon/order/list",
      data: { orderId:this.data.id}
    }).then(res=>{
      let list=res.data;
      let flag=true;
      for(let i=0;i<list.length;i++){
        if (list[i].id == this.data.payInfo.cpnRelId){
          if(!list[i].useBalance){
            flag=false;
            break;
          }
        }
      }
      this.setData({
        couponList: res.data.filter(item => item.enableUse == 1 || ( item.id == this.data.payInfo.cpnRelId)),
        couactive:flag ? (this.data.payInfo.cpnRelId || 0) : 0
      })
      this.getAllBalance();
    })
  },

  // 选择支付方式（余额，优付卡）
  selectedPayType(type) {
    
    this.setData({
      type:this.data.type==type ? 0 : type
    })
  },

  // 微信金额
  wxAmount() {
    let amt = this.data.payInfo.payablePrice - this.data.discountAmount - this.data.sysAmount;
    return amt < 0 ? 0 : amt;
  },

  initPayMode(){
    this.setData({
      payMode: this.wxAmount() ? "微信支付￥" + Number(this.wxAmount() / 100).toFixed(2) : "确认付款"
    })
  },

  onShowPop(){
    this.setData({
      showpPopup:true
    })
  },

  onSelectCoupon(e){
    let item=getApp().hep.dataset(e,"item");
    if (!item.useBalance && this.data.type==1 && item!="none"){
      getApp().hep.dig({
        type:"sm",
        // icon:"error",
        content:"该优惠券不能与余额同时使用",
        showCancel:false,
      })
      return;
    }
    if(item=='none'){
      getApp().http({
        url: "coupon/unused",
        data: {
          orderId: this.data.id,
        }
      }).then(res => {
        this.setData({
          couactive: 0,
          showpPopup: false,
          discountAmount: 0,
          useBalance: item.useBalance ? true : false
        })
      })
    }
    else{
      getApp().http({
        url: "coupon/use",
        data: {
          orderId: this.data.id,
          relId: item.id
        }
      }).then(res => {
        this.setData({
          couactive: item.id,
          showpPopup: false,
          discountAmount: item.amount,
          useBalance: item.useBalance ? true : false
        })
      })
    }
   
  },

  onPopup(e){
    this.setData({
      showpPopup: e.detail.popup
    })
  },


  onSelectBalance(e){
    let type=getApp().hep.dataset(e,"type")
    if(!this.data.useBalance && this.data.couactive){
      return
    }
    this.selectedPayType(type)
  },

  onSubmitPay(){
  
    // return;
    this.setData({
      btnStatus:true
    })
    let data={
      orderId: this.data.id,
    }
    if (this.data.sysAmount && this.data.type == 1) {
      // data["balance"] = this.data.sysAmount;
      data.balance = this.data.sysAmount;
    }
    if (this.data.payInfo.cpnRelId) {
      // data["cpnRelId"] = this.data.sysAmount;
      data.cpnRelId = this.data.payInfo.cpnRelId;
    }

    if (this.data.type == 2) {
      data.groupCardType = 41;
    }
    let _this = this;

    getApp().http({
      url:'tradePay/wxUnifiedOrder',
      data,
      custom:true
    }).then(res=>{
      if(res && res.httpCode==200){
        const payConfig = res.data;
        let _this=this
        if(payConfig){
          wc.wxPay(payConfig,(res)=>{
            setTimeout(()=>{
              getApp().hep.toRoute("reto", "../orderDetail/orderDetail?id=" + this.data.id)
            },1000)
          },(res)=>{
            _this.payFail();
          })
        }
        else{
          getApp().hep.dig({
            type:"st",
            title:"付款成功",
            url: "../orderDetail/orderDetail?id=" + this.data.id,
            toType:"reto"
          })
        }
      }
      else{
        getApp().hep.dig({
          type:"st",
          title: res.msg,
          icon:"error"
        })
        this.setData({
          btnStatus: false
        })
      }
    })
  },

  payFail(){
    getApp().http({
      url:"tradePay/unlockOrder",
      data:{
        orderId:this.data.id
      }
    }).then(res=>{
      this.queryPayInfo();
      this.setData({
        btnStatus: false
      })
    })
  },

  startTime(){
    let list = filter.getDateTime(this.data.payInfo.expTime - this.data.nowtime).split(":")
    let _this=this;
    var wxTimer = new downTimer({
      beginTime: `00:${list[1]}:${list[2]}`,
      complete: function () {
        wxTimer.stop();
        _this.finsh();
      }
    })
    wxTimer.start(this);
    
  },

  finsh(){
    this.setData({
      payEffective:false,
      btnStatus:true
    })
  },

})