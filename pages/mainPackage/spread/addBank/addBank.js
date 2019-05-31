// pages/mainPackage/spread/addBank/addBank.js
const validate = require("../../../../utils/helpers/validate.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    form: {
      bankName: "",
      bankCode: "",
      name: "",
      verifyCode: "",
      accountNo: "",
      phone: ""
    },
    countdown: 60,
    countdownText: '获取验证码',
    bankList:[],
    startTime: false,
    disabled: false,
    dialog: false,
    submitLoading: false,
    timer:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.getBanks();
     
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
  // 提交银行卡信息
  submit() {
    if (!this.checkbankCode()) return false;
    if (!this.checkName()) return false;
    if (!this.checkAccountNo()) return false;
    if (!this.checkPhone()) return false;
    if (!this.checkVerifyCode()) return false;
    this.setData({
      disabled: true
    })
    getApp().http({
      url:"tradeWallet/add",
      data:this.data.form,
      custom: true
    }).then(res =>{
      if (res.httpCode !== 200) {
        getApp().hep.dig({ type: "st", title: res.msg, icon: "error" })
        this.setData({
          disabled : false
        })
      } else {
        clearInterval(this.data.timer);
        getApp().hep.dig({ type: "st", title: '添加成功！', toType: "reto", url: "/pages/mainPackage/spread/withdraw/withdraw" })
      }
    })
  },
  // 获取验证码
  getVerificationCode() {
    if (this.checkPhone()) {
      this.setData({
        startTime: true
      })
      getApp().http({
        url:"sms/verifyBank",
        data:{phone:this.data.form.phone},
        custom: true
      })
        .then(res => {
          let self = this;
          if (res.httpCode != 200) {
            getApp().hep.dig({ type: "st", title: res.msg, icon: "error" })
            this.setData({
              startTime: false,
              countdown: 60
            })
          }else{
            this.data.timer=setInterval(()=>{
              if (this.data.countdown <= 0 && this.data.startTime){
                clearInterval(this.data.timer);
                this.setData({
                  startTime: false,
                  countdownText: "重新发送",
                  countdown: 60
                })
              }else{
                this.setData({
                  countdown: this.data.countdown-1
                })
              }

            },1000)
          }
        });
    }
  },
  // 验证码倒计时结束
  finish() {
    this.startTime = false;
    this.countdown = 60;
  },
  // 获取银行列表
  getBanks() {
      getApp().http({
        url:"dic/bank"
      }).then(res =>{
        this.setData({
          bankList : res.data,
          dialog: true
        })
        console.log(this.data.bankList)
      })
  },
  // 选择银行
  selectBank(value) {
    let bank = this.data.bankList[value.detail.value];
    let obj = value.detail.value.split(",");
    
    this.data.form.bankCode = bank.val;
    this.data.form.bankName = bank.showText;
    this.setData({
      'form.bankCode': this.data.form.bankCode,
      'form.bankName': this.data.form.bankName,
      dialog: false
    })
  },
  // 校验持卡人姓名
  checkName() {
    let len = String(this.data.form.name).length;
    if (!/\S/.test(this.data.form.name) || len < 2 || len > 6) {
      getApp().hep.dig({ type: "st", title: "姓名长度2-6个非空字符", icon: "error" })
      return false;
    }
    return true;
  },
  // 校验手机号
  checkPhone() {
    if (!validate.tel(this.data.form.phone)) {
      getApp().hep.dig({ type: "st", title: "手机号格式有误", icon: "error" })
      return false;
    }
    return true;
  },
  // 校验银行卡
  checkAccountNo() {
    if (!/^([1-9]{1})(\d{12,19})$/.test(this.data.form.accountNo)) {
      getApp().hep.dig({ type: "st", title: "请输入正确的银行卡号", icon: "error" })

      return false;
    }
    return true;
  },
  // 校验验证码
  checkVerifyCode() {
    if (!/^\d{4,10}$/.test(this.data.form.verifyCode)) {
      getApp().hep.dig({ type: "st", title: "请输入4-10位验证码", icon: "error" })
      return false;
    }
    return true;
  },
  // 校验银行账户
  checkbankCode() {
    if (this.data.form.bankCode === "") {
      getApp().hep.dig({ type: "st", title:"请选择银行账户", icon:"error"})
      return false;
    }
    return true;
  },
  // XInput is-type验证函数
  typeAccountNo() {
    if (/^([1-9]{1})(\d{12,19})$/.test(this.data.form.accountNo)) {
      return { valid: true };
    } else {
      return { valid: false, msg: "请输入正确的银行卡号" };
    }
  },
  inputName(e){
    this.data.form.name = e.detail.value;
    this.setData(
      {"form.name": e.detail.value}
    )
  },
  inputAccountNo(e) {
    this.data.form.accountNo = e.detail.value;
    this.setData(
      { "form.accountNo": e.detail.value }
    )
  },
  inputPhone(e) {
    this.data.form.phone = e.detail.value;
    this.setData(
      { "form.phone": e.detail.value }
    )
  },
  inputVerifyCode(e) {
    this.data.form.verifyCode = e.detail.value;
    this.setData(
      { "form.verifyCode": e.detail.value }
    )
  }

})