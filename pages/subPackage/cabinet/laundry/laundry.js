const storage=require("../../../../utils/helpers/storage.js");
const methodser=require("../../../../utils/helpers/methodser.js");
const bizconsts=require("../../../../utils/variable/bizconsts.js");
const watch=require("../../../../utils/view/watch.js");

Page({

  data: {
    tel: "",
    count:1,
    reduceImgUrl: "",
    addImgUrl: "",
    iconUrl:[]
  },


  onLoad: function (options) {
    this.setIconurl();
    watch.setWatch(this,this.watch);
  },

  watch:{
    count(){
      if(!this.checkCount()){
        this.reduceImgUrl = this.data.iconUrl[5].minusDisable
        this.setData({
          reduceImgUrl: this.reduceImgUrl,
        })
      }
     
    }
  },
  setIconurl(){
    const imgurl = getApp().hep.imgurl + "icon"
    this.data.iconUrl=[
      {
        addLink: `${imgurl}/add_link.png`
      },
      {
        addActive: `${imgurl}/add_active.png`
      },
      {
        addDisabled: `${imgurl}/add_disable.png`
      },
      {
        minusLink: `${imgurl}/minus_link.png`
      },
      {
        minusActive: `${imgurl}/minus_active.png`
      },
      {
        minusDisable: `${imgurl}/minus_disable.png`
      }
    ]
    this.setData({
      tel: bizconsts.SERVICE_TEL,
      reduceImgUrl:this.data.iconUrl[5].minusDisable,
      addImgUrl:this.data.iconUrl[0].addLink
    })
  },

  //下单
  onOdrerBtn:function(){
    let _this=this;
    getApp().hep.dig();
    getApp().http({
      url:'order/cupboard/add',
      data:{
        cupboardCode: getApp().hep.getScene("query").code,
        createCnt:_this.data.count
      }
    }).then(res=>{
      wx.hideLoading();
      let params={
        optway: bizconsts.coubord.ORDER,
        orderId: res.data.orderId,
        cupboardDoor: res.data.cupboardDoor,
        code: getApp().hep.getScene("query").code
      }
      storage.setCoubordInfo(params)
      getApp().hep.toRoute("rech", '../enterOrder/enterOrder');
    })
    
  },

  //拨打客服电话
  makePhoneCall(){
    methodser.callPhone(this.data.tel);
  },

  //查看用户协议
  userProtocolFn(){
    getApp().hep.toRoute("navgo","/pages/mainPackage/user/userProtocol/userProtocol")
  },

  chStartRuduce(){
    if(!this.checkCount()){
      return;
    }
    this.setData({
      reduceImgUrl: this.data.iconUrl[4].minusActive,
      count: this.data.count -= 1
    })
  },
  chEndReduce(){
    if(!this.checkCount()){
      return;
    }
    this.setData({
      reduceImgUrl: this.data.iconUrl[3].minusLink,
     
    })
  },
  chStartAdd(){
    this.setData({
      addImgUrl: this.data.iconUrl[1].addActive,
      count: this.data.count += 1
    })
  },
  chEndAdd(){
    this.setData({
      addImgUrl: this.data.iconUrl[0].addLink,
      reduceImgUrl: this.data.iconUrl[3].minusLink,
    })
  },
 checkCount(){
    return this.data.count<=1 ? false : true;
 }
})