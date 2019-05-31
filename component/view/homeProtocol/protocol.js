const dickeyval = require("../../../utils/variable/dickeyval.js");
const methods=require("../../../utils/helpers/methodser.js");
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    userprotocol:{
      type:null,
      observer(newval) { 
        if (JSON.stringify(newval)!="{}"){
          this.init();
          
        }
        
      },
    }
  },

  data: {
    checkBox:true,
    showPopup:false, 
    tswayList: dickeyval.TSWAY_LIST
  },
  methods: {
    init(){
      let list = this.data.tswayList;
      let isCupboard = methods.getConfigInfo("isCupboard");
      let publicUrl = "/pages/mainPackage/creationOrder/"
      let urlList = [`${publicUrl}conciseOrder/conciseOrder`, `${publicUrl}cupboardOrder/cupboardOrder`, `${publicUrl}storeOrder/storeOrder`]
      for (let i = 0; i < list.length; i++) {
        if (list[i].isShow != 1) {
          list[i].isShow = isCupboard;
        }
        list[i].url = urlList[i];
      }
      this.setData({
        tswayList: list
      })
    },
    onwash(){
      if(!this.data.checkBox){
        getApp().hep.dig({
          type:"st",
          icon:"error",
          title:"请同意洗衣协议"
        })
        return;
      }

      this.setData({
        showPopup:true
      })
    },
    checkboxChange(e){
      this.setData({
        checkBox: !this.data.checkBox
      })
    },

    routePush(e){
      let item = getApp().hep.dataset(e, "item");
      getApp().hep.toRoute("navgo",item.url);
    }
  }
})
