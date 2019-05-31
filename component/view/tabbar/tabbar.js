Component({
  
  /**
   * 组件的属性列表
   */
  properties: {
    tabbarList: {
      type: null,
      value: [{
        "pagePath": "/pages/mainPackage/tabbar/index/index",
        "text": "首页",
        "iconPath": "/static/img/tabbar/home.png",
        "selectedIconPath": "/static/img/tabbar/homeed.png"
        },
        {
          "pagePath": "/pages/mainPackage/tabbar/order/order",
          "text": "订单",
          "iconPath": "/static/img/tabbar/order.png",
          "selectedIconPath": "/static/img/tabbar/ordered.png"
        },
        {
          "pagePath": "/pages/mainPackage/tabbar/personal/personal",
          "text": "我的",
          "iconPath": "/static/img/tabbar/me.png",
          "selectedIconPath": "/static/img/tabbar/meed.png"
        }]
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {

    navigation(e){
      let pageurl = getApp().hep.dataset(e,"pageurl");
      getApp().hep.toRoute("swtab", pageurl)
    },
  }

})
