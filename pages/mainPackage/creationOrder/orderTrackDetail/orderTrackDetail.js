// pages/mainPackage/creationOrder/orderTrackDetail/orderTrackDetail.js
Page({

 
  data: {
    trackList:[],
    id:"",
    orderInfo:{}
  },

  onLoad: function (options) {
    getApp().hep.callback(()=>{
      this.data.id=options.id;
      this.getTrackList();
      this.getOrderInfo();
    })
  },


  onShow: function () {},
  getOrderInfo(){
    getApp().http({
      url:'order/concise',
      data:{
        id:this.data.id
      }
    }).then(res=>{
      this.setData({
        orderInfo:res.data
      })
    })
  },
  getTrackList(){
    getApp().http({
      url:"orderStatus/list",
      data:{
        id:this.data.id
      }
    }).then(res=>{
      this.setData({
        trackList:res.data || []
      })
    })
  }
})