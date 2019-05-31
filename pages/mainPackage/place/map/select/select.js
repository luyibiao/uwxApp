// pages/mainPackage/place/map/select/select.js
const wc = require("../../../../../utils/config/wxConfig.js");
const imgurl = getApp().hep.imgurl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWords:"",
    selectImg: imgurl +"icon/select.png",
    searchBtnList:[],
    selectName:"",
    center: {
      latitude: 28.216004,
      longitude: 112.880701
    },
    keyWords:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onInput(e) {
    this.data.keyWords = e.detail.value;
    let _this = this
    wc.getWxLocation((res) => {
      _this.setData({
        searchBtnList: res.data
      })
    }, () => { }).searchAddress(this.data.keyWords)
  },
  //搜索地址
  onSearch() {
    let _this = this;

    wc.getWxLocation((res) => {

      let list = res.data
      let data = {
        latitude: list.length ? list[0].location.lat : _this.data.center.latitude,
        longitude: list.length ? list[0].location.lng : _this.data.center.longitude
      }
      // let json = JSON.stringify(data)
      // let url = '/pages/mainPackage/place/map/map?data='+json
      // getApp().hep.toRoute("reto", url)
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.loadFn(data);
      wx.navigateBack({
        delta: 1  // 返回上一级页面。
      });

    }).searchAddress(this.data.keyWords);

  },
  onSelectAddress(e) {
    let item = getApp().hep.dataset(e, "item");
    let data = {
      location:{
        lat: item.location.lat,
        lng: item.location.lng,
      },
      formatted_addresses:{
        recommend: item.title,
      },
      address: item.address,
      address_component:{
        province: item.ad_info.province,
        city: item.ad_info. city,
        district: item.ad_info.district
      },
      ad_info:{
        adcode: item.ad_info.adcode
      }
    }

    this.setData({
      keyWords:"",
      searchBtnList: []
    })
    //let json = JSON.stringify(data)

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.loadFn(data);
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    });
  }
})