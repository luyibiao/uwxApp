
Page({

  /**
   * 页面的初始数据
   */
  data: {
    html:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().http({
      url:'userProtocol/open/detail',
    }).then(res=>{
      this.data.html=res.data.text;
      this.setData({
        html: this.data.html
      })
    })
  },
  onAgree(){
    getApp().hep.toRoute("reto", `/${getCurrentPages()[getCurrentPages().length - 2].route}`);
  },
})