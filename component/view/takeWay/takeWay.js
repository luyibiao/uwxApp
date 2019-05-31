const mixins = require("../../../utils/behaviors/mixinsComponent.js");
const tsway=require("../../../utils/behaviors/tsway.js");
const filter=require("../../../utils/helpers/filter.js");
const methods=require("../../../utils/helpers/methodser.js");
const storage=require("../../../utils/helpers/storage.js")
const mutations=require("../../../utils/helpers/mutations.js")

Component({
  mixins:[tsway],
  options: {
    addGlobalClass: true,
  },
  properties: {
    startLoad:{
      type:Boolean,
      observer(newval){
        if(newval){
          let _this = this;
          // methods.discountMoney();
          this.getTsWayList((res) => {
            
            _this.getTsWay(res);
          });
        }
      }
    }
  },

  data: {
    showPopup:false,
    tsList:{},
    active:"",
    wayInfo:{},
    wayType:"",
    wayTypeText:"",
    wayMoney:"",
    wayDescList:[],
    wayIslink:true
  },

  attached(){},

  methods: {
    onShowPop(){
      if (!this.data.wayIslink) {
        return;
      }
      this.setData({
        showPopup:true
      })
    },
    getTsWay(res){
      this.setData({
        tsList: this.data.tsway
      })
      if (res.tsnum == 1) {
        this.data.wayInfo = this.data.tsList[res.typeList[0]];
        this.onEnter();
        this.setData({
          wayIslink: false
        })
      }
    },
    onSelectWay(e){
      let item=getApp().hep.dataset(e,"item");
      let index = getApp().hep.dataset(e, "index");
      this.setData({
        active:index,
        wayInfo:item
      })
    },
    onEnter(){
      this.data.wayType = this.data.wayInfo[0].type
      this.countTsMoney();
      this.setData({
        showPopup: false,
        wayTypeText: `${filter.getValText(this.data.wayType, "EXPRESS_TYPE")}取送`,
        wayDescList: this.data.wayInfo
      })
    },

    countTsMoney(){
     
      getApp().http({
        url:'mercCarriage/queryRepeat',
        data:{
          type: this.data.wayType,
          money: storage.getShopInfo().moneyInfo ? storage.getShopInfo().moneyInfo.disMoney || 0 : 0
        }
      }).then(res=>{
        this.setData({
          wayMoney: res.data.sendCarriage + res.data.takeCarriage
        })
        let queryObj = { ...this.data.wayInfo, ...{ takeExpressType: this.data.wayType, wayMoney: this.data.wayMoney } }
        this.triggerEvent("callback", queryObj);
        
        // mutations.updateMoney(storage.getShopInfo(),{wayMoney:this.data.wayMoney})
      })
    }
    
  }
})
