// pages/mainPackage/place/noOpenAddress/noOpenAddress.js
Page({

  data: {
    html:""
  },

  onLoad: function (options) {
    getApp().hep.callback(()=>{
      this.init()
    })
  },

  init(){
    getApp().http({
      url:"regionAssignTip/detail"
    }).then(res=>{
      this.setData({
        html: res.data.text || {}
      })
    })
  }
})
