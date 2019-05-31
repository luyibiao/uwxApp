const bizconsts = require("../../../../utils/variable/bizconsts.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headLoding: false,
    auditList: [],
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
      this.queryAuditList();
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
    this.data.auditList = [];
    this.queryAuditList();
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
    this.queryAuditList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  queryAuditList() {
    getApp().http({
      url: "tradeAudit/list",
      data: {
        startRow: this.data.pagination.pageNum * this.data.pagination.size,
        pageSize: this.data.pagination.size
      }
    }).then(res => {
      this.setPageSize(res);
      this.setData({
        headLoding: true
      })
      getApp().hep.dig({ type: 'hl' });
    })
  },
  //是否禁止上拉加载
  checkListLength() {
    if (this.data.auditList.length >= this.data.pagination.total) {
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
    this.data.auditList = this.data.auditList.concat(res.data.list)
    this.data.pagination.total = res.data.total;
    this.data.pagination.pageNum = this.data.auditList.length != 0 ? this.data.auditList.length / this.data.pagination.size : 0;
    this.setData({
      auditList: this.data.auditList,
      loadingText: ''
    })
  }
})