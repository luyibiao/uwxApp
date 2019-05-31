// pages/mainPackage/spread/plan/plan.js
const filter = require("../../../../utils/helpers/filter.js")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"",
    title:"友商推广计划",
    content:"",
    isVerify: true,
    loading: false,
    baseLoading: true,
    dialog: {
      show: false,
      phone: "",
      name: ""
    },
    modalLoading: false,
    confirmText: '确认手机号',
    iscancel: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => { 
      this.getPlanFn();
      this.getVerifyFn();
      wx.setNavigationBarTitle({
        title: this.data.title
      })
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
  getPlanFn(){
    getApp().http({
      url:"friendInfo/recruit/info"
    }).then(res=>{
      this.data.title = res.data.title;
      this.data.content = res.data.content;
      this.setData({
        content: this.data.content
      });
    })
  },
  // 获取是否需要验证手机号标识
  getVerifyFn(){
    getApp().http({
      url:'friendInfo/verifyPhone'
    }).then(res=>{
        this.data.isVerify = res.data.isVerify == 1
    })
  },
  // 打开成为友商弹窗
  openDialogFn() {
    this.data.isVerify ? (this.setData({ "dialog.show": true, baseLoading:false,loading:true })) : this.registeredFn();
  },
  registeredFn(data){
    this.setData({
      loading: true,
      "dialog.show": false,
      baseLoading: true
    })
    getApp().http({
       url:"friendInfo/apply",
      data: data,
      custom:true
    }).then(res=>{
      if(res.httpCode == 200){
        getApp().hep.dig({ type: "st", title: "恭喜,注册成功！", time: 1500, url: "/pages/mainPackage/spread/index/index", toType:"reto" });
      }else{
        getApp().hep.dig({ type: "st", title: res.msg, icon: "error" });
        this.setData({
          loading: false,
          baseLoading: false,
          "dialog.show":true
        })
      }
      
    })
  },
  submit(){
    let len = String(this.data.dialog.name).length;
    if (!/\S/.test(this.data.dialog.name) || len < 2 || len > 6) {
      getApp().hep.dig({ type: "st", title:"昵称长度2-6个非空字符", icon:"error"})
      return false;
    }
    if (!filter.tel(this.data.dialog.phone)) {
      getApp().hep.dig({ type: "st", title: "手机号格式错误", icon: "error" })
      return false;
    }
    this.registeredFn({
      name: this.data.dialog.name,
      phone: this.data.dialog.phone
    });
  },
  openBaseLoading(){
    this.setData({
      "dialog.show":false,
      baseLoading:true,
      loading: false
    })
  },
  checkNameInputFn(e){
    let value = e.detail.value;
    this.data.dialog.name = value ? value.trim() : '';
  },
  checkPhoneInputFn(e){
    let value = e.detail.value;
    this.data.dialog.phone = value ? value.trim() : '';
  }
})