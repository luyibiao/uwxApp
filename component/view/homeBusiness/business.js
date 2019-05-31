// component/view/business/business.js
const imgurl = getApp().hep.imgurl + "shop"
const methods = require("../../../utils/helpers/methodser.js");
Component({
  clothesImg: imgurl + '/item/clothes2.png',
  options: {
    addGlobalClass: true,
  },
  properties: {
    businessList:{
      type:null,
      observer(){
       
      }
    }
  },

  data: {
    bizStyle: methods.getConfigInfo('bizStyle')
  },

  methods: {
    onSelectBus(e){
      let item=getApp().hep.dataset(e,"item");
      getApp().hep.toRoute("navgo", "/pages/mainPackage/creationOrder/goodsList/goodsList?businessId=" + item.businessId)
    }
  }
})
