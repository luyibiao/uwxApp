// pages/mainPackage/user/userTrade/userTrade.js
const bizconsts = require("../../../../utils/variable/bizconsts.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsFlag: false,
    tradeList:[],//余额明细列表
    detail: {},
    loadingText:'',
    pagination: {
      size: bizconsts.pageSz.PAGE_SIZE,
      total: 0,
      pageNum: 0
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.queryTrade();
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
    
    if(this.data.detailsFlag){
      wx.stopPullDownRefresh();
      return;
    }
    if (!this.data.detailsFlag ){
      
      getApp().hep.dig();
      this.data.pagination.pageNum = 0;
      this.queryTrade();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.detailsFlag){
      return
    }

    if (!this.checkListLength()){
      return;
    }
    this.setData({
      loadingText: "加载中..."
    })
    getApp().hep.dig();
    this.queryTrade();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //消费明细
  queryTrade(){
    getApp().http({
      url:"trade/list",
      data:{
        startRow: this.data.pagination.pageNum * this.data.pagination.size,
        pageSize: this.data.pagination.size
      }
    }).then(res=>{
      this.setPageSize(res);
    })
    
  },
  //是否禁止上拉加载
  checkListLength() {
    if (this.data.tradeList.length >= this.data.pagination.total || this.data.tradeList.length < this.data.pagination.size) {
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
    this.data.tradeList = this.data.pagination.pageNum == 0 ? res.data.list : this.data.tradeList.concat(res.data.list)
    this.data.pagination.total = res.data.total;
    this.data.pagination.pageNum = res.data.pageNum
    this.setData({
      tradeList: this.data.tradeList
    })
  },
  toDetailFn(e){
    let index = parseInt(getApp().hep.dataset(e, "index"));
    this.data.detail = this.data.tradeList[index];
    this.setData({
      detail: this.data.detail,
      detailsFlag: true
    })
  },
  toListFn(){
    this.setData({
      detailsFlag: false
    })
  }
})