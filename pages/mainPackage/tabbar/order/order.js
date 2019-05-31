const bizconsts = require("../../../../utils/variable/bizconsts.js");
const storage = require("../../../../utils/helpers/storage.js");
const wc=require("../../../../utils/config/wxConfig.js");
const clothing = bizconsts.coubord.CLOTHING;
const cloak = bizconsts.coubord.CLOAK;
Page({
  data: {
    navList: [{
        id:0,
        name: "全部"
      },
      {
        id: 1,
        name: "待付款"
      },
      {
        id: 2,
        name: "已完成"
      },
      {
        id: 3,
        name: "已取消"
      },
    ],
    icon:{
      noOrderIcon: "",
    },
   
    popFlag: false,
    parmas: {},
    list: [],
    active: 0,
    pagination: {
      size: bizconsts.pageSz.PAGE_SIZE,
      total: 0,
      pageNum: 0
    },
    loadingText: "",
    couBord: {
      type: "",
      nameDesc: "",
      id: ""
    }
  },

  onLoad: function(options) {
    let _this=this
    getApp().hep.callback(() => {
      _this.data.parmas = options ? options : {}
      _this.checkCode();
      _this.setIconUrl();
      _this.init();
     
    }, this.route)
  },

  onReady: function() {},

  onShow: function() {
  
  },
  init(){
    if (storage.getShopInfo()){
      storage.removeStorage(bizconsts.storage.SHOP_INFO);
    }
   
  },

  setIconUrl(){
    this.setData({
      "icon.noOrderIcon": `${getApp().hep.imgurl}delimg/none_order.png`
    })
  },

  onOrderDetail(e) {
    let item=getApp().hep.dataset(e,'item');
    getApp().hep.toRoute("navgo", "/pages/mainPackage/creationOrder/orderDetail/orderDetail?id="+item.id)
  },


  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    this.data.pagination.pageNum = 0;
    this.checkCode();
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function() {
    if (!this.checkListLength()) {
      return;
    }
    this.setData({
      loadingText: "加载中..."
    })
    getApp().hep.dig();
    this.checkCode();

  },

  onShareAppMessage: function() {

  },

  //检验查询列表
  checkCode: function() {
    getApp().hep.dig();

    if (this.data.parmas.code) {
      this.getTakeClokeList(this.data.parmas.type);
    } else {
      this.getList();
    }
  },

  //取件存件列表
  getTakeClokeList: function(type) {
    let _this = this;

    getApp().http({
      url: type == clothing ? "order/cupboard/list" : "order/cupboard/bookList",
      data: {
        cupboardCode: this.data.parmas.code
      }
    }).then(res => {
      this.setPageSize(res);
    })
  },

  //所有列表
  getList: function() {
    let _this = this;
    let listUrl = ["order/list", "order/pay/list", "order/complete/list", "order/cancel/list"];
    getApp().http({
      url: listUrl[this.data.active],
      data: {
        startRow: this.data.pagination.pageNum * this.data.pagination.size,
        pageSize: this.data.pagination.size
      }
    }).then(res => {
      this.setPageSize(res);
    })
  },

  //导航栏切换
  myNavBtn: function(e) {
    this.setScrollPage(e)
    this.checkCode();
  },

  //设置切换状态参数
  setScrollPage(e){
    this.data.pagination.pageNum = 0;
    this.data.pagination.total = 0;
    this.data.parmas = {}
    this.data.active = e.detail.selected
    wx.pageScrollTo({
      scrollTop: 10,
      duration: 0
    })
  },

  //取衣开箱
  btnOptionTake: function(event) {
    this.data.couBord.type = clothing;
    this.setPopupContent(event, "sendAddress");
  },

  //存衣开箱
  btnOptionSave(event) {
    this.data.couBord.type = cloak;
    this.setPopupContent(event, "takeAddress");
  },

  //付款
  btnOptionPay(e) {
    let item=getApp().hep.dataset(e,"item")
    getApp().hep.toRoute("navgo", "/pages/mainPackage/creationOrder/orderTrade/orderTrade?id=" + item.id)
    // getApp().hep.dig({
    //   type: "sm",
    //   title:" ",
    //   content: "小程序暂不支持付款，请扫智柜上的公众号二维码，进行付款再来开箱取衣",
    //   showCancel: false,
    //   confirmText: "我知道了"
    // })
  },

  setPopupContent(event, nameDesc) {
    Object.defineProperties(this.data.couBord, {
      nameDesc: {
        writable: true,
        value: getApp().hep.dataset(event, "item", nameDesc)
      },
      id: {
        writable: true,
        value: getApp().hep.dataset(event, "item", "id")
      }
    })
    this.data.popFlag = true;
    this.setData({
      popFlag: this.data.popFlag,
      "couBord.nameDesc": this.data.couBord.nameDesc
    })
  },

  //弹出框回调
  onPopup(e) {
    this.data.popFlag = e.detail.popup
    this.setData({
      popFlag: false
    })
  },

  //确认开箱
  onEnter() {
    getApp().http({
      url: this.data.couBord.type == clothing ? "order/cupboard/take" : "order/cupboard/bookOpen",
      data: {
        id: this.data.couBord.id
      }
    }).then(res => {
      this.setEenterParams(res.data, this.data.couBord.type)
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

  //开箱取消
  onCancel() {
    this.setData({
      popFlag: false
    })
  },

  //是否禁止上拉加载
  checkListLength() {
    if (this.data.list.length >= this.data.pagination.total || this.data.list.length < this.data.pagination.size) {
      this.setData({
        loadingText: "已经到底啦~~~"
      })
      return false;
    }
    return true
  },

  //分页参数赋值
  setPageSize(res) {
    wx.hideLoading();
    wx.stopPullDownRefresh();
    this.data.list = this.data.pagination.pageNum === 0 ? res.data.list : this.data.list.concat(res.data.list)
    this.data.pagination.total = res.data.total;
    this.data.pagination.pageNum = res.data.pageNum
    this.data.list.forEach(function (item) {
      if (item.business) {
        var blist = JSON.parse(item.business)
        var tmpList = []
        blist.forEach(function (item) {
          tmpList.push(item.name)
        })
        item.businessStr = tmpList.join('/')
      }
    })
    this.setData({
      list: this.data.list
    })
  }
})