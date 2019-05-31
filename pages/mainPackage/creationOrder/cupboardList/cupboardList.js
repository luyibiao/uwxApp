const mutations=require("../../../../utils/helpers/mutations.js");
const storage=require("../../../../utils/helpers/storage.js")
Page({

  data: {
    coubordList:[],
    imgurl:""
  },

  onLoad: function (options) {
    getApp().hep.callback(()=>{
      this.loadFn()
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },
  loadFn(){
    this.init();
    this.getCoubordList();
  },
  init() {
    let imgurl=getApp().hep.imgurl;
    this.setData({
      imgurl: `${imgurl}delimg/cabinet_head.png`
    })
  },
  getCoubordList(){
    getApp().hep.dig();
    getApp().http({
      url:'cupboard/list',
      data:{}
    }).then(res=>{
      this.setData({
        coubordList: res.data
      })
      wx.hideLoading();
    })
  },

  onCoubord(e){
    let item=getApp().hep.dataset(e,"item");
    mutations.updateMoney(storage.getShopInfo(),{cupBoardInfo:item},()=>{
      getApp().hep.toRoute("navback","/pages/mainPackage/creationOrder/cupboardOrder/cupboardOrder")
    })
  },

})