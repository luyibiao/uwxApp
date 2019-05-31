// pages/mainPackage/spread/profit/profit.js
const bizconsts = require("../../../../utils/variable/bizconsts.js");
const filter = require("../../../../utils/helpers/filter.js")

let type ={
  "0502": { title: "消费分润明细", tradeType: "0502" },
  "0503": { title: "消费充值明细", tradeType: "0503" },
  "0501": { title: "加粉分润", tradeType: "0501" }
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    headLoding: false,
    list: [],
    type: {},
    loadingText: '',
    pagination: {
      size: bizconsts.pageSz.PAGE_SIZE,
      total: 0,
      pageNum: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.initType(options);
      this.queryListFn();
    }, this.route)
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
      getApp().hep.dig();
      this.data.pagination.pageNum = 0;
      this.data.list=[];
    this.queryListFn();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.checkListLength()) {
      return;
    }
    this.setData({
      loadingText: "加载中..."
    })
    getApp().hep.dig();
    this.queryListFn();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 初始化查询类型
  initType(data) {
    this.data.type = type[data.tradeType] || type["0502"];
    this.data.type.uri =
      data.type == "month"
        ? "profitDetail/month/list"
        : "profitDetail/list";
    this.data.type.date = data.date ;//filter.getDate( || new Date());
    let times = this.data.type.date.replace(/\d+\-/, "").replace("-", "月");
    this.data.type.times =
      data.type == "month"
        ? times+'月'
        : times + "日";

    this.setData({
      type:this.data.type
    })
    wx.setNavigationBarTitle({
      title: this.data.type.times + this.data.type.title
    })
  },
  queryListFn() {
    let time = this.data.type.date.length == 7 ? this.data.type.date+"-01" : this.data.type.date;
    getApp().http({
      url: this.data.type.uri,
      data: {
        tradeType: this.data.type.tradeType,
        date: time,
        startRow: this.data.pagination.pageNum * this.data.pagination.size,
        pageSize: this.data.pagination.size
      }
    }).then(res => {
      this.setPageSize(res);
      this.setData({
        headLoding:true,
        list:  res.data.list
      })
      getApp().hep.dig({type:'hl'});
    })
  },
  //是否禁止上拉加载
  checkListLength() {
    if (this.data.list.length >= this.data.pagination.total) {
      this.setData({
        loadingText: "已经到底啦~~~"
      })
      return false;
    }
    return true
  },
  //分页参数赋值
  setPageSize(res) {
    wx.hideLoading();
    wx.stopPullDownRefresh();
    this.data.list = this.data.list.concat(res.data.list)
    this.data.pagination.total = res.data.total;
    this.data.pagination.pageNum = this.data.list.length != 0 ? this.data.list.length / this.data.pagination.size : 0;
    this.setData({
      list: this.data.list,
      loadingText: ''
    })
  },

})