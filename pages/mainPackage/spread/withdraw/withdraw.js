// pages/mainPackage/spread/withdraw/withdraw.js
const calculation = require("../../../../utils/helpers/calculation.js");
const validate = require("../../../../utils/helpers/validate.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      bank:{
        accountName:"",
        accountNo:""
      },
      walletId:'',
      amount: ""
    },
    accountNo:'',
    banks:[],
    minExtractMoney: '',//单笔最低提现金额限制
    balance: 0,
    showBanks: false,
    loading: false,
    addLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.getBalance();
      this.getBanks();
      wx.setNavigationBarTitle({
        title: this.data.showBanks ? "选择银行卡" : "提现"
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

  } ,
  //友商余额
  getBalance() {
    getApp().http({
      url:"friendInfo/balance"
    }).then(res =>{
      this.setData({
        balance: res.data.balance || 0,
        minExtractMoney: res.data.minExtractMoney || 0,
      })
    })
  },
  // 获取银行账户
  getBanks() {
    getApp().http({
      url:"tradeWallet/list"
    }).then(res =>{
      this.data.banks = res.data;
      if (this.data.banks){
        this.setData({
          banks: this.data.banks,
          "form.bank": this.data.banks[0],
          "accountNo": this.data.banks[0].accountNo.toString().split("*")[1],
          "form.walletId": this.data.banks[0].id
        })
      }
      
    })
  },
  tradeAudit(){
    if (!this.checkAmount() || !this.checkWalletId()){
      return;
    }
    getApp().http({
      url:"tradeAudit/apply",
      data:{
        walletId: this.data.form.walletId,
        amount: calculation.accMul(this.data.form.amount, 100),
        constom: true
      }
    }).then(res => {
      if (res.data.httpCode !== 200) {
        getApp().hep.dig({ type: "st", title: res.msg, icon: "error" });
      } else {
        getApp().hep.dig({ type: "st", title: "申请成功", url: '/pages/mainPackage/user/userCard/userCard', toType: 'reto' });
      }
    })
  },
   // 校验提现金额
  checkAmount() {
    var minMoney = this.data.minExtractMoney > 1 ? calculation.accDiv(this.data.minExtractMoney, 100) : 0.01
    if (
      !validate.amount(
        this.data.form.amount,
        2,
        minMoney,
        calculation.accDiv(this.data.balance, 100)
      )
    ) {
      getApp().hep.dig({ type: "st", title: "提现金额错误", icon: "error"})
      return false;
    }
    return true;
  },
  // 校验银行账户
  checkWalletId() {
    if (this.data.form.walletId === "") {
      getApp().hep.dig({ type: "st", title: "请选择银行账户", icon: "error" })
      return false;
    }
    return true;
  },
  // 选择银行账户
  selectBank() {
    (this.data.banks && this.data.banks.length)
      ? (
        this.setData({
          showBanks : true
        })
      )
      : getApp().hep.toRoute('nvago', '/pages/mainPackage/spread/addBank/addBank');
      this.showHeadText();
  },
  // 保存所选的银行账户
  saveBank(e) {
    let item = getApp().hep.dataset(e,'item')
    this.setData({
      "form.bank":item,
      "form.walletId":item.id,
      accountNo: item.accountNo.toString().split("*")[1],

      showBanks: false
    })
    this.showHeadText();
    
  },
  // 全部提现
  withdrawAll() {
    this.data.form.amount = calculation.accDiv(this.data.balance, 100);
    this.setData({
      'form.amount': calculation.accDiv(this.data.balance, 100)
    })
  },

  toAddBank(){
    getApp().hep.toRoute('nvago', '/pages/mainPackage/spread/addBank/addBank');
  },
  showHeadText(){
    wx.setNavigationBarTitle({
      title: this.data.showBanks ? "选择银行卡" : "提现"
    })

  }
})