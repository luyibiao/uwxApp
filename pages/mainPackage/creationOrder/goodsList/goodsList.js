const storage=require("../../../../utils/helpers/storage.js");
const bizconsts = require("../../../../utils/variable/bizconsts.js"); 
const dickeyval=require("../../../../utils/variable/dickeyval.js");
const watch=require("../../../../utils/view/watch.js");
const methods=require("../../../../utils/helpers/methodser.js");
const mixins=require("../../../../utils/behaviors/mixins.js")
const tsway=require("../../../../utils/behaviors/tsway.js");
const imgurl = getApp().hep.imgurl + "shop"
Page({
  mixins: [tsway],
  data: {
    vipPriceShow: 0,
    clothesImg: imgurl + '/item/clothes2.png',
    isStartFlag:false,
    userCard:{},
    serviceNav:{
      isStartFlag:false,
      dataquery:0
    },
    styleJson:{
      width:0,
      height:0
    },
    purchaseFullImgUrl: `${imgurl}/icon/purchase_full.png`,
    popup:{
      popupFlag:false,
      type:0,//0 购车车 1结算方式 2自定义数量
      popstyle:{}
    },
    shopList:[],
    selectShopList:[],
    shopInfo:{
      shopCount:0,
      expectNum:0,
      vipExpectNum:0,
      onlyInfo:{}
    },
    cntPopup:{
      show:false,
      cnt:"",
      name:"",
      price:"",
      info:""
    },
    tswayList: dickeyval.TSWAY_LIST,
    orderMode: bizconsts.orderMode,
    ts:{
      tsMsg: "",
      tsType:"",
      tsPrcie:"",
      tsNum:0,
    },
    mercBusinessId:"",
    purchaseFullImgUrlFlag: false, // 购物车动画
  },

  //监听商品数组变化计算价格及数量
  watch: {
    selectShopList() {
      wx.nextTick(()=>{
        let list = this.data.selectShopList;
        let shopNum = 0;
        let priceNum = 0;
        let vipPriceNum = 0;
        for (let i = 0; i < list.length; i++) {
          
          priceNum = priceNum + list[i].cnt * list[i].price;
          vipPriceNum += list[i].cnt * (list[i].vipPrice ? list[i].vipPrice : list[i].price)
          shopNum = shopNum + parseInt(list[i].cnt);
        }
        this.getOneNum();
        this.setData({
          "shopInfo.vipExpectNum": vipPriceNum,
          "shopInfo.expectNum": priceNum,
          "shopInfo.shopCount": shopNum,
          purchaseFullImgUrlFlag:true
        })
        if(this.data.ts.tsNum==1){
          this.checkTsWay();
        }
      })
      
    }
  },
  
  onLoad: function (options) {
    watch.setWatch(this, this.watch);
    getApp().hep.callback(() => {
        this.loadFn(options);
    }, this.route)
  },

  onReady: function () {

  },

  onShow: function () {
    this.setData({
      orderMode: bizconsts.orderMode,
    })
  },

  loadFn(options){
    this.initConfig(options);
    // storage.removeStorage(bizconsts.storage.SHOP_INFO);
    this.getCityInfo();
    this.getCardDetail();
    this.getTsWayList(()=>{
      this.checkTsWay();
    });
  },

  //初始化配置
  initConfig(options){
    this.setData({
      "serviceNav.isStartFlag": true,
      "serviceNav.dataquery": options.businessId || 0
    })
  },

  //得到城市配置信息
  getCityInfo(){
    let list = this.data.tswayList;
    this.data.vipPriceShow = storage.getMercInfo().isOpenVipPrice;
    let createStoreOrder = storage.getCityInfo().createStoreOrder;
    let storeOrderEnable = storage.getCityInfo().storeOrderEnable;
    let isCupboard = methods.getConfigInfo("isCupboard");
    let publicUrl = "/pages/mainPackage/creationOrder/"

    var storeUrl = 'storeOrder/storeOrder';
    if (!createStoreOrder) {
      storeUrl = 'storeList/storeList';
    }

    let urlList = [`${publicUrl}visitOrder/visitOrder`, `${publicUrl}cupboardOrder/cupboardOrder`, publicUrl + storeUrl]
    for(let i=0;i<list.length;i++){
      if (list[i].isShow != 1) {
        list[i].isShow = isCupboard;
      }
      list[i].url = urlList[i];
    }

    list[2].isShow = storeOrderEnable;

    this.setData({
      // "configInfo.createMode": methods.getConfigInfo("createMode") ,
      tswayList: list,
      vipPriceShow: this.data.vipPriceShow
    })
  },

  //得到缓存的商品的信息
  getStorage(){
    if (storage.getShopInfo()){
      this.setShopStorage(storage.getShopInfo().list)
    }
  },

  //选择商品
  onselectShop(e){
    let item=getApp().hep.dataset(e,"item");
    this.setData({
      "cntPopup.info": item,
    })
    if (item.isCustomNum){
      this.setData({
        "cntPopup.show":true,
        "cntPopup.cnt":item.cnt ? item.cnt : ""
      })
      return;
    }
    let list=this.data.selectShopList;
    if(list.length==0){
      this.setNoRepeatShop(list,item);
    }
    else{
      let repeat=this.updateSelectShop(item,"+");
      if (!repeat){
        this.setNoRepeatShop(list, item)
      }
    }
  },

  //当选择的衣物没有被选择过时
  setNoRepeatShop(list,item){
    item['cnt']=1;
    item['mercBusinessId'] = this.data.mercBusinessId;
    list.push(item);
    this.setShopStorage(list);
  },
  
  //自定义文本框失去焦点
  onCntBlur(e){
    this.setData({
      "cntPopup.cnt":e.detail.value
    })
  },
  //清除自定义商品
  onclearCnt(){
    this.setData({
      "cntPopup.cnt":0
    })
  },

  //点击自定义商品时
  onConfirmCnt(){
    let list=this.data.selectShopList;
    let repeat=false
    // return;
    for(let i=0;i<list.length;i++){
      if (list[i].id == this.data.cntPopup.info.id){
        if(this.data.cntPopup.cnt==0){
          list[i].cnt=0;
          list.splice(i, 1);
        }
        else{
          list[i].cnt =parseInt(this.data.cntPopup.cnt);
        }
        
        this.setShopStorage(list)
        repeat=true
        break;
      }
    }
    if (!repeat &&  this.data.cntPopup.cnt > 0){
      let item = this.data.cntPopup.info
      item['mercBusinessId'] = this.data.mercBusinessId
      item["cnt"] = parseInt(this.data.cntPopup.cnt);
      list.push(item);
      this.setShopStorage(list);
    }
    this.setData({
      "cntPopup.show":false
    })
  },

  //设置选择商品信息及更新数据
  setShopStorage(list){
    
    this.setData({
      selectShopList: list,
    })
   
    if(list.length===0){
      storage.removeStorage(bizconsts.storage.SHOP_INFO);
      return;
    }
    let obj={};
    obj={
      list: list,
    }
      
    storage.setShopInfo(obj)
  },

  //清除商品
  clearShop(){
    this.setShopStorage([]);
  },

  //计算操作后的数据
  updateSelectShop(item,type){
    let list = this.data.selectShopList;
    let repeat = false
    for(let i=0;i<list.length;i++){
      if (item.name === list[i].name){
        list[i]['mercBusinessId'] = this.data.mercBusinessId
        repeat = true
       
        if(type=="+"){
          list[i]['cnt']++;
        }
        else{ 
          list[i]['cnt']--;
          if(list[i].cnt==0){
            list.splice(i,1);
          }
        }
        this.setShopStorage(list);
        break;
      }
    }
    return repeat;
  },

  //获取单个商品选择数量
  getOneNum(){
    let list=this.data.shopList;
    let slist=this.data.selectShopList;  
    let item=this.data.cntPopup.info;
    for(let i=0;i<list.length;i++){
      let flag = false
      for(let j=0;j<slist.length;j++){
        if(list[i].name==slist[j].name && list[i].id==slist[j].id){
            list[i]['cnt']=slist[j].cnt;
            flag=true
            
        }
      }
      if(!flag && list[i].cnt){
        delete list[i].cnt
      }
    }
    this.setData({
      shopList: list
    })
  },

  //点击加添加商品
  addShop(e){
    let item=getApp().hep.dataset(e,"item");
    this.updateSelectShop(item,"+"); 
  },

  //点击减减少商品
  reduceShop(e){
    let item = getApp().hep.dataset(e, "item");
    this.updateSelectShop(item, "-"); 
  },

  //点击购物车控制弹出框显示
  onshowPopup(){
    this.setPopContent(60, 0, !this.data.popup.popupFlag, 1000)
  },

  //关闭弹出框
  closePop(){
    this.setData({
      "popup.popupFlag":false
    })
  },

  //自定义弹框框回调
  onPopup(e){
    this.data.popup.popupFlag = e.detail.popup
  },

  //点击下单按钮
  PlaceAnOrder(){
    if(this.data.selectShopList.length===0){
      getApp().hep.dig({
        type:"st",
        icon:"error",
        title:"请选择商品"
      })
      return;
    }
    let _this = this;
    let orderMode=this.data.orderMode
    if (orderMode.CURRENT_MODE == orderMode.BESPOKE_MODE) { //预约模式

      let storeOrderEnable = storage.getCityInfo().storeOrderEnable;
      let isCupboard = methods.getConfigInfo("isCupboard");

      if (storeOrderEnable || isCupboard) {
        if (this.data.popup.popupFlag) {
          this.setData({
            "popup.popupFlag": false,
          })
          setTimeout(function () {
            _this.setPopContent(0, 1, true, 1002)
          }, 300)
        } else {
          _this.setPopContent(0, 1, true, 1002)
        }
      }
       
      methods.discountMoney(()=>{
        if (!storeOrderEnable && !isCupboard) {
          getApp().hep.toRoute("navgo", "../visitOrder/visitOrder")
        }
      });//计算折扣后的总价格
    } else if (orderMode.CURRENT_MODE == orderMode.CABINET_MODE){
      methods.discountMoney(() => {
        getApp().hep.toRoute("navgo", "../cupboardOrder/cupboardOrder")
      });
    } else { //下单支付模式
      methods.discountMoney(()=>{
        getApp().hep.toRoute("navgo","../visitOrder/visitOrder")
      });
    }
  },

  //点击服务方式
  routePush(e){
    let item=getApp().hep.dataset(e,"item");
    getApp().hep.toRoute("navgo",item.url);
    this.setPopContent(0, 1, false, 1002)
  },

  //设置购物车内容
  setPopContent(bottomStyle, type, popupFlag, zIndexStyle){
    let popstyle=`bottom:${bottomStyle}px;z-index:${zIndexStyle}`
    let obj={
      "popup.type": type,
      "popup.popupFlag": popupFlag,
      "popup.popstyle": popstyle
    }
    this.setData(obj)
  },

  //校验取送费
  checkTsWay(){
    let obj = this.data.tsway;
    if(JSON.stringify(obj)=="{}"){
      this.setData({
        "ts.tsMsg":"免运费"
      })
      return;
    }
    let num=0;
    for(let i in obj){
      num++;
      this.data.ts.tsType=i;
    }
    this.setData({
      "ts.tsNum":num
    })
    if(num>1){
      this.setData({
        "ts.tsMsg":"运费根据取送方式计算"
      })
      return;
    }
    if(num===1){
      this.getTsMoney();
    }
  },

  //得到取送价格
  getTsMoney(){
    getApp().http({
      url:"mercCarriage/queryRepeat",
      data:{
        type: this.data.ts.tsType,
        money: this.data.shopInfo.expectNum
      }
    }).then(res=>{
      this.setData({
        "ts.tsPrcie": res.data.sendCarriage + res.data.takeCarriage
      })
    })
  },

  //得到商品价格目标
  getGoodsList(e){
    getApp().hep.dig();
    let query=e.detail;
    let dataObj={};
    dataObj.businessId = query.parentId;
    query.childrenId ? dataObj.typeId = query.childrenId : ""
    this.data.mercBusinessId = query.mercBusinessId
    getApp().http({
      // url:'business/price/list',
      url: dataObj["typeId"] ? "business/price/list" : "business/product/type/list",
      data: dataObj
    }).then(res=>{
      wx.hideLoading();
      let list=res.data;
      this.getStorage();
      this.setData({
        shopList: list
      })
    })
  },

  //购物车动画结束事件
  endPurchaseFull() {
    this.setData({
      purchaseFullImgUrlFlag: false
    })
  },
  getCardDetail(){
    getApp().http({
      url: 'card/detail'
    }).then(res => {
      this.setData({
        userCard: res.data
      })
    })
  }
})