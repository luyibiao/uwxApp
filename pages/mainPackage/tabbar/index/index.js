const storage = require("../../../../utils/helpers/storage.js");
const bizconsts=require("../../../../utils/variable/bizconsts.js");
const methods=require("../../../../utils/helpers/methodser.js");
Page({

  data: {
    swiper:{
      indicatorDots: true,
      autoplay:true,
      circular: true,
      interval:2000,
      duration:300,
      imgAd:{},
      imgUrlList:[],
      menuList: [],
      mediaList: []
    },
    config:{
      isClientAdve:"",//是否显示首页轮播
      cityName:"",//选择城市名
      createMode:"",
      oneKeyCreate:"", //是否开启了一键下单
      isCupboard:"" , //是否开启了预约智柜
      showBookCupboard:"" , //是否展示首页智柜
      showOutsideLink: "", // 是否显示外链
      topOutsideLink: "", // 是否置顶外链
      showMedia: "", // 是否显示图片及视频
    },
    modal:{
      isStartLocate:false
    },
    viewConfig:{
      bussinessList:[],
      cabinetList:[],
      userProtocol:{}
    },
    
  },

  onLoad: function (options) {
   
  },

  onShow(){
    //所有初始请求执行完开始回调 
    getApp().hep.callback(() => {
      this.loadFn();
    },this.route)
  },

  //初始加载方法
  loadFn() {
    this.initConfig();
    bizconsts.orderMode.CURRENT_MODE == bizconsts.orderMode.ROOR_MODE ? this.getProtocol() : this.getBusinessList()
  },

  //初始化配置信息
  initConfig(){
    let cfobj = storage.getCityInfo();
    let obj={
      "config.isClientAdve": cfobj.isClientAdve,
      "config.cityName":cfobj.name,
      "config.createMode": bizconsts.orderMode,
      "config.oneKeyCreate": methods.getConfigInfo("oneKeyCreate"),
      "config.isCupboard": methods.getConfigInfo("isCupboard"),
      "config.showBookCupboard": methods.getConfigInfo("showBookCupboard"),
      "config.showOutsideLink": methods.getConfigInfo("showOutsideLink"),
      "config.topOutsideLink": methods.getConfigInfo("topOutsideLink"),
      "config.showMedia": methods.getConfigInfo("showMedia"),
      "modal.isStartLocate":true,
      
    } 

    // 如果显示轮播
    if(cfobj.isClientAdve){
      this.querySwiperList(11);
    }

    // 如果显示外链
    if (cfobj.showOutsideLink) {
      this.querySwiperList(13)
    }

    // 如果显示图片跟视频
    if (cfobj.showMedia) {
      this.querySwiperList(15)
    }

    this.querySwiperList(12);
    this.querySwiperList(14);

    if (storage.getShopInfo()) {
      storage.removeStorage(bizconsts.storage.SHOP_INFO);
    }

    this.setTxBar();
    this.setData(obj)
  },

  //获取轮播图图片
  querySwiperList(i){
    getApp().http({
      url:"clientAdve/open/list",
      data:{
        scene: i
      }
    }).then(res=>{
      // this.data. = list;
      if (i == 11) {
        this.setData({
          "swiper.imgUrlList": res.data || []
        })
      }
      if (i == 12) {
        this.setData({
          "viewConfig.cabinetList": res.data || []
        })
      }
      if (i == 13) {
        this.setData({
          "swiper.menuList": res.data || []
        })
      }
      if (i == 14) {
        if (res.data.length > 0) {
          this.setData({
            "imgAd": res.data[0]
          })
        }
      } 
      if (i == 15) {
        this.setData({
          "swiper.mediaList": res.data || []
        })
      }
    })  
  },

  //设置头部导航
  setTxBar(){
    wx.setNavigationBarTitle({
      title: storage.getMercInfo().name
    })
  },

  //得到经营大类列表
  getBusinessList(){
    getApp().http({
      url:'mercBusiness/open/list',
      data:{}
    }).then(res=>{
      this.setData({
        "viewConfig.bussinessList": res.data.list || []
      })
    })
  },

  // //得到智柜
  // getCabinet(){
  //   getApp().http({
  //     url:"clientAdve/open/list",
  //     data:{
  //       scene: 12
  //     }
  //   }).then(res=>{
      
  //   })
  // },

  //得到用户协议
  getProtocol(){
    getApp().http({
      url:'userProtocol/open/detail',
    }).then(res=>{
      this.setData({
        "viewConfig.userProtocol": res.data
      })
    })
  },

  //选择城市
  onSelect(){
    getApp().hep.toRoute("navgo","/pages/mainPackage/place/locate/locate")
  },

  //判断城市定位执行完回调
  locateCallback(e){
    this.data.modal.isStartLocate = e.detail.modal
  },

  //一键下单模式进入按钮
  onRootOrder(){
    getApp().hep.toRoute("navgo","/pages/mainPackage/creationOrder/conciseOrder/conciseOrder")
  },

  routeShop(){
    getApp().hep.toRoute("navgo","/pages/mainPackage/creationOrder/goodsList/goodsList?businessId="+2)
  },
  getImgAd(){
    getApp().http({
      url: 'clientAdve/open/list',
      data:{
        scene: 14
      }
    }).then(res => {
      if(res.data.length >0){
        this.setData({
          "imgAd": res.data[0]
        })
      }
    })
  },
  toImgUrl(e){
    let url = getApp().hep.dataset(e, "url");
    if(url){
      getApp().hep.toRoute("rech", `/${url}`)
    }
  }
})