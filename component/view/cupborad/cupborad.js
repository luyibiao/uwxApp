const storage=require("../../../utils/helpers/storage.js")
Component({
  options: {
    addGlobalClass: true,
  }, 
  properties: {
    startFlag:{
      type:Boolean,
      observer(newval) {
        if(newval){
          this.getCouboardInfo();
        }
       },
    }
  },

  data: {
    couboardInfo:{}
  },

  pageLifetimes: {
    show: function () {
      
    },
  },
  methods: {
    getCouboardInfo(){
      let shopInfo = storage.getShopInfo() ? storage.getShopInfo() : null;
      if (shopInfo &&  shopInfo.moneyInfo.cupBoardInfo){
        this.setData({
          couboardInfo: shopInfo.moneyInfo.cupBoardInfo
        })
        this.triggerEvent('callback', shopInfo.moneyInfo.cupBoardInfo)
      }
    },
    toCoubord(){
      getApp().hep.toRoute("navgo","/pages/mainPackage/creationOrder/cupboardList/cupboardList")
    },
  }
})
