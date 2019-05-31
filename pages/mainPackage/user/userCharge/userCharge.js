// pages/mainPackage/user/userCharge/userCharge.js
const storage = require("../../../../utils/helpers/storage.js");
const filter = require("../../../../utils/helpers/filter.js");
const calculation = require("../../../../utils/helpers/calculation.js");
const wc = require("../../../../utils/config/wxConfig.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    rechargeList:[],
    placeholderText:"",
    bottonName:"",
    moneyOrCode:"",
    loading: false,
    plain: false,
    active:0,
    loadingText: "加载中...",
    balance: 0,
    recharge:{},
    navList:[
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    getApp().hep.callback(() => {
      this.initNavList();
      this.queryBalance();
      this.queryRechargeList();
      wx.setNavigationBarTitle({
        title: storage.getMercInfo().name
      });

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
    // this.data.navList =[]
    // this.initNavList();
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
  //导航栏切换
  myNavBtn: function (e) {
    let buttonName = '';
    let placeholderText = '';
    if (e.detail.query.id == 1){
      buttonName = '立即充值'
      placeholderText = "输入其他金额"
    }
    if (e.detail.query.id == 2){
      buttonName = '立即兑换'
      placeholderText = "输入充值卡上的兑换码"
    }
    this.setData({
      active: e.detail.query.id,
      buttonName: buttonName,
      placeholderText: placeholderText, 
      moneyOrCode:''
    })
  },
  //设置切换状态参数
  setScrollPage(e) {
    this.data.pagination.pageNum = 0;
    this.data.pagination.total = 0;
    this.data.parmas = {}
    this.data.active = e.detail.query.id
    wx.pageScrollTo({
      scrollTop: 10,
      duration: 0
    })
  },
  /** 查询余额**/
  queryBalance(){
    getApp().http({
      url: "userExt/queryBalance",
    }).then(res => {
      let money = this.data.balance;
      let resBalance=res.data.balance
      let second=20;
      let speed = (resBalance - money) / second;
      let timer=setInterval(()=>{
        money += speed;
        this.setData({
          balance: money,
        })
        if (money >= resBalance) {
          clearInterval(timer)
          
        }
        
      },50)
    })
  },
  queryRechargeList(){
    getApp().http({
      url: "rechargeRule/queryRechargeList",
    }).then(res => {
      let list = res.data;
      
        list.forEach(function (item) {
          let ruleList = [];
          if (item.isSendAmt && item.giftAmount > 0) {
            ruleList.push('赠送金额' + filter.amtFormat(item.giftAmount) + '元')
          }
          if (item.isSendCoupon && item.couponCnt > 0) {
            ruleList.push('赠送优惠券:' + item.couponCnt + '张')
          }
          if (item.isSendPoint && item.giftPoint > 0) {
            ruleList.push('送' + item.giftPoint + '积分')
          }
          if (item.isSendCard) {
            ruleList.push('送会员卡:' + item.cardName + '')
          }
          var ruleHTML = ruleList.join('，')
          item.ruleHTML = ruleHTML && typeof (ruleHTML) !== 'undefined' ? ruleHTML : '无赠送'
        });
      this.setData({
        rechargeList: list,
        loadingText:"已经到底啦~~~"
      })
    })
  },
  rechargeFn(e){
    this.setData({
      loading:true
    })
    let params = {}
    let moneyOrCode = e.detail.value ? e.detail.value.moneyOrCode : getApp().hep.dataset(e, "moneyorcode");
    if (!moneyOrCode){
      getApp().hep.dig({ type: "st", title: this.data.active == 1 || this.data.active == 3 ? "请填写金额" :"请填写兑换码",icon:"error"});
      this.setData({
        loading:false
      })
      return;
    }
    if (this.data.active == 1|| this.data.active == 3){
      params.amount = calculation.accMul(moneyOrCode,100)
      if (this.data.active == 3) {
        params.withActive = 1;
      }
    }
    if (this.data.active == 2){
      params.redeemCode = moneyOrCode;
    }
    getApp().http({
      url: (this.data.active == 1 || this.data.active == 3) ? "/tradePay/wxRecharge" :"rechargeCard/redeem",
      data: params,
      custom: true
    }).then(res=>{
      if(res.httpCode == 200){
        if (this.data.active == 2){
          getApp().hep.dig({ type: "st", title: "充值成功" });
          this.setData({
            moneyOrCode: '',
          })
          this.queryBalance();
        }else{
          let _this=this;
          wc.wxPay(res.data, ()=>{
            _this.wxPaySucceed()
          })
        }
        
      }else{
        getApp().hep.dig({ type: "st", title: res.msg, icon: "error" });
        this.setData({
          moneyOrCode: ''
        })
      }

      this.setData({
        loading: false
      })
    
     
    })
  },
  getRecharge(e){
    this.data.recharge = getApp().hep.dataset(e, "obj");
    this.setData({
      active:3,
      recharge: this.data.recharge
    })

  },
  escList(){
    this.setData({
      loading: false,
      active: 0,
      recharge: {}
    })
  },
  initNavList(){
    let online = {id: 0, name: "在线充值"};
    let other = {id: 1, name: "其他金额"};
    let card = {id: 2, name: "充值卡充值"};
    this.data.navList.push(online)

    getApp().http({
      url:"city/open/detail"
    }).then(res => {
      if (res.data.otherRecharge == 1){
        
        this.data.navList.push(other)
      }
      this.data.navList.push(card);
      this.setData({ navList: this.data.navList })
    })
  },

  wxPaySucceed(){
    getApp().hep.toRoute("swtab", "/pages/mainPackage/tabbar/personal/personal");
  }
  
})