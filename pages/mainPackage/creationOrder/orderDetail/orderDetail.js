const imgurl = getApp().hep.imgurl
const downTimer = require("../../../../utils/view/wxTimer.js");
const filter=require("../../../../utils/helpers/filter.js");
const bizconsts=require("../../../../utils/variable/bizconsts.js");
const storage=require("../../../../utils/helpers/storage.js");
const wxbarcode = require("../../../../utils/view/wxbarcode.js")

Page({

  data: {
    loginFlag: false,
    vipPriceShow: 0,
    updateRemarkFlag: false,
    isVip: 0,
    progressNode:{
      list: [],
      stateIndex: 0,
      imgurl: `${imgurl}icon/step`
    },
    order:{
      id:"",
      allPrice:'',//衣物总额
      nowtime:"",//时间戳
      shareEnable:false, //分享券开关
      shareAlertShow:true,
      shareEnableScroll:false
    },
    iconUrl:{
      tsExpressIcon: `${imgurl}delimg/sf_logo.png`,
      tsWorkerIcon: `${imgurl}delimg/def.png`,
      shareIcon:`${imgurl}icon/share_log.png`,
      shareArrow: `${imgurl}icon/share-arrow.png`,
    },
    orderInfo:{},
    orderStatusList:[],//订单追踪
    orderPayTradeList:[],//支付信息
    clothInfo:{
      proPriceList: [],//衣物信息
      productList:[],//入库后附加信息列表
      picCnt:0, //入库后衣物图片数量
    },
    takeExpressInfo:{},//取件服务商信息,
    sendExpressInfo:{},//送件服务商信息
    wxTimerList: {},
    shareConf:{}, //分享优惠券配置
  },

  onLoad: function (options) {
    this.data.order.id=options.id;
  },

  onReady: function () {

  },

  onShareAppMessage(){
    return getApp().hep.shareContent(this.data.shareConf.title, `/pages/mainPackage/user/userCoupon/addShareCoupon/addShareCoupon?ids=${this.data.shareConf.couponId}`, "https://cdn.ukaocloud.cn/wxapp/bdimg/share_content-log.png")

    // return {
    //   title: this.data.shareConf.title,
    //   path:"/pages/mainPackage/coupon/obtainShareList",
    //   imageUrl: "https://cdn.ukaocloud.cn/wxapp/bdimg/share_content-log.png"
    // }
  },

  onPageScroll(e) {
    if (!this.data.order.shareEnable){
      return;
    }
    if(e.scrollTop<299){
      this.setData({
        "order.shareEnableScroll": false
      })
      return;
    }
      this.setData({
        "order.shareEnableScroll":true
      })
  },

  onShow: function (options) {
    
    getApp().hep.callback(() => {
      this.loadFn();
    })
  },

  onHide: function () {

  },

  onUnload: function () {

  },
  loadFn(){
    this.setData({
      vipPriceShow: storage.getMercInfo().isOpenVipPrice || 0
    })
    this.getCardDetail();
    this.getProgressList();
    this.getDetail();
    this.queryOrderStatus();

  },

  //得到洗衣步骤
  getProgressList(){
    getApp().http({
      url:'orderStatus/queryProgressNode',
      data:{
        id: this.data.order.id
      }
    }).then(res=>{
      this.setData({
        "progressNode.list":res.data
      })
      let list = res.data;
      list.forEach((item,index)=>{
        if(item.state==1){
          this.setData({
            "progressNode.stateIndex":index
          })
        }
      })
    })
  },

  //得到订单详情
  getDetail(){
    getApp().hep.dig();
    // return;
    getApp().http({
      url:'order/detail',
      data:{
        id: this.data.order.id
      }
    }).then(res=>{
      let orderInfo=res.data;
      this.formatQuery(orderInfo,(data)=>{
        this.setData({
          loginFlag:true,
          orderInfo: data,
          "clothInfo.proPriceList": data.proPriceDesc,
          "order.nowtime": res.timestamp
        })
        if (this.data.orderInfo.expTime){
          this.startTime();
        }
      });
      wxbarcode.barcode('barcode', this.data.orderInfo.orderNo, 488, 130);
      // wxbarcode.qrcode('barcode', this.data.orderInfo.orderNo, 120, 120);
      wx.hideLoading();
    })
  },

  //得到订单追踪列表
  queryOrderStatus(){
    getApp().http({
      url:"orderStatus/list",
      data:{
        id: this.data.order.id
      }
    }).then(res=>{
      let statusList = res.data || [];
      if (statusList.length > 2) {
        this.setData({
          orderStatusList: statusList.slice(0, 2)
         })
      } else {
        this.setData({
          orderStatusList: statusList,
        })
      }
    })
  },

  //得到支付详情列表
  tradeOrderList(orderId){
    getApp().http({
      url:'trade/order/list',
      data:{
        orderId: orderId
      }
    }).then(res=>{
      this.setData({
        orderPayTradeList:res.data.list
      })
    })
  },

  //得到附加特征列表
  productRelList(orderId){
    getApp().http({
      url:'orderProduct/list',
      data:{
        orderId: orderId
      }
    }).then(res=>{
      let list=res.data;
      let plist=[];
      let cnt=0;
      list.forEach(function (item) {
        var tmpList = [];
        var tmpChdList = [];
        if (item.colorDesc) {
          //颜色
          item.colorDesc = JSON.parse(item.colorDesc);
          tmpList = [...tmpList, ...item.colorDesc];
        }
        if (item.flawDesc) {
          //瑕疵
          tmpList = [...tmpList, ...JSON.parse(item.flawDesc)];
        }
        if (item.effectDesc) {
          //洗后效果描述
          tmpList = [...tmpList, ...JSON.parse(item.effectDesc)];
        }
        if (item.picCnt){
          //衣物图片数量
          cnt+=item.picCnt
        }
        tmpList.forEach(function (item) {
          tmpChdList.push(item.name)
        })
        item.addServiceDesc = item.addServiceDesc
          ? JSON.parse(item.addServiceDesc)
          : [];
        item.proDetail = tmpChdList.join(",");
      });
      this.setData({
        "clothInfo.productList": list,
        "clothInfo.picCnt":cnt
      })
    })
  },

  //得到取送人员服务商信息
  queryExpressDetail(expressNo, expressType, mode){
    getApp().http({
      url:'expressInfo/detail',
      data:{
        expressNo: expressNo,
        type: expressType
      }
    }).then(res=>{
      if (mode == 1) {
        this.setData({
          takeExpressInfo: res.data
        })
      } else {
        this.setData({
          sendExpressInfo: res.data
        })
      }
    })
  },
  
  //获取分享优惠券配置
  queryShareConf(){
    getApp().http({
      url:"coupon/queryShareConf",
      data:{
        orderId: this.data.order.id
      }
    }).then(res=>{
      this.setData({
        shareConf:res.data,
        "order.shareEnable": res.data && res.data.shareEnable
      })
    })
  },

  //格式化字段
  formatQuery(res,fn){
    
    let orderobj=res;
    if (orderobj.id){
      if (orderobj.payStatus) {
        this.tradeOrderList(orderobj.id);
      }
      if(orderobj.payStatus===1){
        this.queryShareConf();
      }
      this.productRelList(orderobj.id);
    }
    if (orderobj.takeExpressNo) {
      this.queryExpressDetail(orderobj.takeExpressNo, orderobj.takeExpressType, 1);
    }
    if (orderobj.sendExpressNo) {
      this.queryExpressDetail(orderobj.sendExpressNo, orderobj.sendExpressType, 2);
    }
    if (orderobj.business){
      let tmpList = [];
      let blist = JSON.parse(orderobj.business);
      blist.forEach(function (item) {
        tmpList.push(item.name);
      });
      orderobj.businessStr = tmpList.join("/");
    }

    if (orderobj.proPriceDesc){
      orderobj.proPriceDesc = JSON.parse(orderobj.proPriceDesc)
    }

    this.countPrice(orderobj);
    
    if(fn && typeof fn=='function'){
      fn(orderobj)
    }
  },

  //计算衣物总价格
  countPrice(orderobj){
    if (orderobj.valuationPrice) {
      this.setData({
        "order.allPrice": orderobj.valuationPrice
      })
      return;
    }
    // if (orderobj.modifyPrice){
    //   this.setData({
    //     "order.allPrice": orderobj.modifyPrice
    //   })
    //   return;
    // }
    if (orderobj.orderPrice){
      this.setData({
        "order.allPrice": orderobj.orderPrice
      })
      return;
    }
    let all=0;
    if (orderobj.proPriceDesc){
      orderobj.proPriceDesc.forEach((item) => {
        let money = this.data.vipPriceShow && this.data.isVip && item.vipPrice ? item.vipPrice : item.price;
        all += (item.discount || 100) * item.cnt * money / 100
      })
    }
    this.setData({
      "order.allPrice":all
      })
  },

  //追踪订单
  onTrack(e){
    let index=getApp().hep.dataset(e,"index");
    if(index>0) return;
    getApp().hep.toRoute("navgo","/pages/mainPackage/creationOrder/orderTrackDetail/orderTrackDetail?id="+this.data.orderInfo.id)
  },

  //倒计时
  startTime() {
    
    let list = filter.getDateTime(this.data.orderInfo.expTime - this.data.order.nowtime).split(":")
    let _this = this;
    let beginTime;
    if (this.data.orderInfo.takeMode==3){
      beginTime=`${list[0]}:${list[1]}:00`
    }
    else{
      beginTime = `00:${list[1]}:${list[2]}`
    }
    var wxTimer = new downTimer({
      beginTime: beginTime,
      complete: function () {
        wxTimer.stop();
        _this.finsh();
      }
    })
    wxTimer.start(this);

  },

  finsh() {
    // this.cancelOrder();
  },

  //确认付款
  onPayOrder(){
    getApp().hep.toRoute("reto","../orderTrade/orderTrade?id="+this.data.order.id);
  },

  //取消订单
  onCancelOrder(){
    let _this=this;
    getApp().hep.dig({
      type:"sm",
      content:"确定是否取消订单?",
      success(res){
        if (res.confirm){
          _this.cancelOrder();
        }
      }
    })
  },

  onBtnOptionTake(){
    getApp().http({
      url:"order/cupboard/take",
      data:{
        id:this.data.orderInfo.id
      }
    }).then(res=>{
      this.setEenterParams(res.data, bizconsts.coubord.CLOTHING)
    })
  },
  //设置 确认开箱界面传递参数
  setEenterParams(resData, optway) {
    let params = {
      optway: optway,
      orderId: resData.orderId,
      cupboardDoor: resData.cupboardDoor,
      code: resData.cupboardCode
    }
    storage.setCoubordInfo(params)
    getApp().hep.toRoute("navgo", "/pages/subPackage/cabinet/enterOrder/enterOrder")
  },

  cancelOrder(){
    this.setData({
      "orderInfo.isEnablePay": false,
      "orderInfo.isEnableCancel":false,
      "orderInfo.statusVal":60,
      "orderInfo.statusText":"已取消"
    })
    getApp().http({
      url:"order/cancel",
      data: { id: this.data.orderInfo.id}
    }).then(res=>{
      getApp().hep.dig({
        type:"st",
        title:"订单取消成功",
        url:"/pages/mainPackage/tabbar/order/order",
        toType:"rech"
      })
    })
  },
  getCardDetail() {
    getApp().http({
      url: 'card/detail'
    }).then(res => {
      this.setData({
        isVip: res.data.isVip
      })
    })
  },
  updateRemarkFlag(){
    this.setData({
      updateRemarkFlag: true
    })
  },
  updateRemark(e){
    this.setData({
      updateRemarkFlag: false
    })
    getApp().http({
      url: "order/userRemark",
      data: { 
        id: this.data.orderInfo.id,
        remark: e.detail.value
       }    
    }).then(res => {
      this.setData({
        "orderInfo.userRemark": e.detail.value
      })
    })
    
  }
})