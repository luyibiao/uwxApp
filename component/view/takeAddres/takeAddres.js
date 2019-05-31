const methods=require("../../../utils/helpers/methodser.js");
const storage=require("../../../utils/helpers/storage.js");
const mutations=require("../../../utils/helpers/mutations.js")
Component({
  options: {
    addGlobalClass: true,
   
  },
  properties: {
    startLoad:{
      type:Boolean,
      observer(newval){
        if(newval){
          this.storageContent();
        }
      }
    }
  },

 
  data: {
    addresInfo:{}
  },

  attached(){
    // methods.
  },
  methods: {
    storageContent(){
     
      let shopInfo = storage.getShopInfo() ? storage.getShopInfo() : null;
      let _this=this
      if (!shopInfo || !shopInfo["moneyInfo"] || !shopInfo["moneyInfo"].orderAddres){
        methods.getAddresList((res) => {
          if(res.data && res.data.length>0){
            mutations.updateMoney(shopInfo,{orderAddres:res.data[0]},()=>{
              let updateShop = storage.getShopInfo();
              _this.setData({
                "addresInfo": updateShop['moneyInfo'].orderAddres
              })
            })
          }
        });
      }
      
      else {
        
        this.setData({
          addresInfo: shopInfo['moneyInfo']['orderAddres']
        })
      }
    },
    routeAddress(){
      getApp().hep.toRoute("navgo", "/pages/mainPackage/place/addressManage/addressManage?type="+1)
    },
  }
})
