// pages/mainPackage/spread/client/client.js
const bizconsts = require("../../../../utils/variable/bizconsts.js");
const filter = require("../../../../utils/helpers/filter.js")
const time = require("../../../../utils/helpers/time.js")
const imgurl = getApp().hep.imgurl 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImg: imgurl + 'delimg/def.png',
    timestamp: '',
    pagination: {
      size: bizconsts.pageSz.PAGE_SIZE,
      total: 0,
      pageNum: 0
    },
    multiArray: [
      [
        { name: "全部状态", value: "" },
        { name: "已结算", value: "settlement_1" },
        { name: "未结算", value: "settlement_0" },
        { name: "已取消关注", value: "subscribe_-1" },
        { name: "已关注", value: "subscribe_1" }
      ],
       [
         { name: "全部时间", value: "" },
         { name: "今天", value: "days_0" },
         { name: "昨天", value: "days_1" },
         { name: "近7天", value: "days_7" },
         { name: "近30天", value: "days_30" },
         { name: "近1年", value: "month_12" }
        ]
      ],
    multiIndex: [0, 0],
    list:[],
    search: {
      startDate: "",
      endDate: "",
      subscribe: "",
      settlement: ""
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.queryListFn()
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
    this.data.list = [];
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
  // 获取提现列表
  queryListFn() {
    getApp().hep.dig();
    this.setData({
      loadingText:"加载中"
    })
    getApp().http({
        url: "fansInfo/friend/list",
        data: {
          startRow: this.data.pagination.pageNum * this.data.pagination.size,
          pageSize: this.data.pagination.size,
          startDate: this.data.search.startDate,
          endDate: this.data.search.endDate,
          subscribe: this.data.search.subscribe,
          settlement: this.data.search.settlement
        }
      })
      .then(res => {
        //this.data.list.push(res.data.list);
        // this.setData({
        //   list : this.data.list,
        //   timestamp: res.timestamp
        // })
        this.setPageSize(res)
        getApp().hep.dig({type:"hl"});
      });
  },
  bindMultiPickerChange(e){
    if (e.detail.value[0] == this.data.multiIndex[0] && e.detail.value[1] == this.data.multiIndex[1]){
      return 
    }
    this.data.multiIndex = e.detail.value
    this.setData({
      multiIndex: e.detail.value
    })
    let status = this.data.multiArray[0][e.detail.value[0]];
    let times = this.data.multiArray[1][e.detail.value[1]];
    // this.search.statusName = status.name;
    // this.search.timeName = times.name;
    if (status.value) {
      let data = status.value.split("_");
      this.data.search[data[0]] = data[1];
      data[0] == "settlement"
        ? (this.data.search.subscribe = "")
        : (this.data.search.settlement = "");
    } else {
      this.data.search.subscribe = "";
      this.data.search.settlement = "";
    }
    if (times.value) {
      let data = times.value.split("_");
      this.data.search.endDate = filter.getDate(new Date());
      this.data.search.startDate = time.add(this.data.search.endDate , -parseInt(data[1]), data[0])
    } else {
      this.data.search.startDate = "";
      this.data.search.endDate = "";
    }
    this.data.pagination.pageNum = 0;
    this.data.list = [];
    this.queryListFn();
  },
  // 是否禁止上拉加载
  checkListLength() {
    if(this.data.list.length >= this.data.pagination.total) {
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
      loadingText: '',
      timestamp: res.timestamp
    })
  },
  
})