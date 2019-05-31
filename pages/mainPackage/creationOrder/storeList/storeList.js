const mutations = require("../../../../utils/helpers/mutations.js");
const storage = require("../../../../utils/helpers/storage.js");
const wxConfig = require("../../../../utils/config/wxConfig.js");
const methodser = require("../../../../utils/helpers/methodser.js");
Page({

  data: {
    loading : false,
    storeList: [],
    createStoreOrder: 1,
    imgurl: "",
    locationImg:"",
    location:{
      lng:"",
      lat:""
    },
    showTabbarFlag: false
  },

  onLoad: function (options) {
    let that = this;
    getApp().hep.callback(() => {
      wxConfig.getWxLocation((res)=>{
        that.loadFn(res.location.lng, res.location.lat);

      }).getAddress();
      //this.loadFn()
    },this.route)
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },
  loadFn(lng, lat) {
    getApp().hep.dig();
    this.init();
    this.getStoreList(lng, lat);
  },
  init() {
    let imgurl = getApp().hep.imgurl;
    
    if(getCurrentPages().length <= 1){
      this.showTabbarFlag = true
    }else{
      this.showTabbarFlag = false
    }
    let createStoreOrder = storage.getCityInfo().createStoreOrder;
    this.setData({
      imgurl: `${imgurl}delimg/store_head.png`,
      locationImg: `${imgurl}icon/u_icon_loc.png`,
      showTabbarFlag: this.showTabbarFlag,
      createStoreOrder: createStoreOrder
    })
  },
  getStoreList(lng, lat) {
    getApp().hep.dig();
    getApp().http({
      url: 'store/near',
      data: {
        lng: lng,
        lat: lat
    
      }
    }).then(res => {
       for(let item in res.data){
         if (res.data[item].distance >=1){
           res.data[item].distance = res.data[item].distance.toFixed(2)
         }else{
           res.data[item].distance = res.data[item].distance.toFixed(3)
         }
       }
      
      this.setData({
        storeList: res.data,
        loading: res.data.length > 0
      })
      wx.hideLoading();
    })
  },

  onCoubord(e) {
    let item = getApp().hep.dataset(e, "item");
    let _this = this;
    mutations.updateMoney(storage.getShopInfo(), { storeInfo: item }, () => {
      if (!this.showTabbarFlag){
        let storeOrderEnable = storage.getCityInfo().storeOrderEnable;
        if (_this.data.createStoreOrder && storeOrderEnable) {
          getApp().hep.toRoute("navback", "/pages/mainPackage/creationOrder/storeOrder/storeOrder")
        }
      }
    })
  },

  onCallPhone(e){
    methodser.callPhone(getApp().hep.dataset(e, "tel"))
  },
  openApp(e) {
    let obj = getApp().hep.dataset(e, "item");
    wx.openLocation({ //出发wx.openLocation API

      latitude: Number(obj.latitude), //坐标纬度（从地图获取坐标）

      longitude: Number(obj.longitude), //坐标经度（从地图获取坐标）

      name: obj.name, //打开后显示的地址名称

      address: (obj.addrDesc || '') + (obj.regionalDesc || '') //打开后显示的地址汉字

    })

  }

})