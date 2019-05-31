const storage = require("../../../utils/helpers/storage.js")
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    startFlag: {
      type: Boolean,
      observer(newval) {
        if (newval) {
          this.getCouboardInfo();
        }
      },
    }
  },

  data: {
    storeInfo: {}
  },

  pageLifetimes: {
    show: function () {

    },
  },
  methods: {
    getCouboardInfo() {
      let shopInfo = storage.getShopInfo() ? storage.getShopInfo() : null;
      if (shopInfo && shopInfo.moneyInfo.storeInfo) {
        this.setData({
          storeInfo: shopInfo.moneyInfo.storeInfo
        })
        this.triggerEvent('callback', shopInfo.moneyInfo.storeInfo)
      }
    },
    toStore() {
      getApp().hep.toRoute("navgo", "/pages/mainPackage/creationOrder/storeList/storeList")
    },
  }
})
