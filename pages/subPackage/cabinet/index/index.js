// pages/cabinet/index/index.js
const storage=require("../../../../utils/helpers/storage.js");
const bizconsts=require("../../../../utils/variable/bizconsts.js");
Page({
  data: {
    cabinet:{},
    emptyCnt:"",
    imgInfo: [{
      name: '下单',
      bgColor: "bg-order",
      imgUrl: `${getApp().hep.imgurl}delimg/order.png`,
      url: "subPackage/cabinet/laundry/laundry",
      goType: "navgo"
    },{
      name: '取衣',
        bgColor: "bg-cloth",
        imgUrl: `${getApp().hep.imgurl}delimg/clothing.png`,
        url: "mainPackage/tabbar/order/order?code=" + getApp().hep.getScene("query").code + "&type="+bizconsts.coubord.CLOTHING,
        goType:"rech"
    }],
  },

  onLoad: function (options) {
   
  },
  onShow(){
    getApp().hep.callback(() => {
      this.loadFn();
    },this.route)
  },
  

  onShareAppMessage: function () {

  },

  loadFn(){
    wx.setNavigationBarTitle({
      title: storage.getMercInfo().name,
    })
    this.getImgPath();
    this.getCupboardDetail();
    this.getCupboardNum();
  },

  //得到智柜下详情
  getCupboardDetail:function(){
    getApp().hep.dig();
    getApp().http({
      url: 'cupboard/detail',
      data:{
        cupboardCode: getApp().hep.getScene("query").code
      }
    }).then(res=>{
      this.data.cabinet=res.data;
      this.setData({
        cabinet: this.data.cabinet
      })
    })
  },

  //得到智柜下详情数量
  getCupboardNum(){
    getApp().http({
      url: 'cupboardBox/queryEmptyCnt',
      data:{
        cupboardCode: getApp().hep.getScene("query").code
      }
    }).then(res=>{
      wx.hideLoading()
      this.setData({
        emptyCnt: res.data.emptyCnt
      })
    })
  },

  //校验柜子操作模式
  getImgPath(){    
      getApp().http({
        url: "order/cupboard/bookCnt",
        data:{
          cupboardCode: getApp().hep.getScene("query").code
        }
      }).then(res=>{
         this.setImgInfo(res.data)
      })
  },

  //设置柜子操作模式
  setImgInfo(count){
    let imgObj = this.data.imgInfo[0];
    let _this=this
    if(count===1){
      this.data.imgInfo[0]={
        name: '存衣',
        bgColor: "bg-cloak",
        imgUrl: `${getApp().hep.imgurl}delimg/cloak.png`,
        url: "mainPackage/tabbar/order/order?code=" + getApp().hep.getScene("query").code + "&type=" + bizconsts.coubord.CLOAK,
        goType: "rech"
      }
    }
    this.setData({
      imgInfo: this.data.imgInfo
    })
  },

  //跳转
  onBtnOption: function (event) {
    let targetUri = {
      type: getApp().hep.dataset(event,"type"),
      url: getApp().hep.dataset(event,"url")
    }
   
    getApp().hep.toRoute(targetUri.type, `/pages/${targetUri.url}`);
  },
 
})