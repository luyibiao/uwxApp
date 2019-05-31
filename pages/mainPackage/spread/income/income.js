// pages/mainPackage/spread/income/income.js
const filter = require("../../../../utils/helpers/filter.js");
const imgurl = getApp().hep.imgurl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'day',
    formatDate: '',
    incomeList: [],
    cutImg: imgurl+'icon/cut.png',
    selectType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.init(options);
    }, this.route);

  },
  init(options){
    wx.setNavigationBarTitle({
      title: options.type == "day" ? '日收成明细' : '月收成明细',
      
    })

    //this.data.type = options.type == "day" ? 'day' :'month'
    let format = options.type == 'day' ? null : 'yyyy-MM';
    this.setData({
      formatDate: filter.formatTtime(new Date().getTime(), format),
      type: options.type,
      selectType: options.type == 'day' ? '按日选择' : '按月选择'
    })
    this.getIncome();

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
  // 获取当前时间收成明细
  getIncome() {
    //this.loading = true;
    getApp().hep.dig();
    let uri = "profitDetail/income/" + this.data.type;
    let _formatDate = this.data.type == 'day' ? this.data.formatDate : this.data.formatDate+'-01'
      getApp().http({
        url:uri,
        data:{
          date: _formatDate
        }
      }).then(res => {
        this.setData({
          total: res.data.total || 0,
          incomeList: res.data.incomeList
        })
        getApp().hep.dig({ type: "hl" })
      });
  },
  // 改变时间
  changeDate(e) {
    let val = parseInt(getApp().hep.dataset(e,"number"));
    
     if(this.data.type == 'day'){
       this.data.formatDate = this.addmulDay(this.data.formatDate, val)
     }else{
       this.data.formatDate =  this.addmulMonth(this.data.formatDate, val)
     }
     this.setData({
       formatDate : this.data.formatDate
     })
    this.getIncome();
  },
  addmulMonth(dtstr, n){   // n个月后 
   
    var s = dtstr.split("-");
    var yy = parseInt(s[0]); var mm = parseInt(s[1] - 1);
    var dt = new Date(yy, mm);
    dt.setMonth(dt.getMonth() + n);
    var year = dt.getFullYear();
    var month = dt.getMonth() + 1;
    var days = dt.getDate();
    var dd = year + "-" + (month.toString().length == 1 ? '0'+month : month);
    return dd;
    },
    addmulDay(dtstr, n){
      var s = dtstr.split("-");
      var yy = parseInt(s[0]); var mm = parseInt(s[1] - 1); var dd = parseInt(s[2]);
      var dt = new Date(yy, mm, dd);
      let time = dt.getTime() + parseInt(n)*24*60*60*1000;
      return filter.getDate(time);
    },
    bindDateChange(e){
      this.data.formatDate = e.detail.value
      this.setData({
        formatDate: e.detail.value
      })
      this.getIncome();
    },
  changeSelectType(){
    let options = {type: this.data.type == 'day' ? 'month' : 'day'}
    this.init(options)
  }
})