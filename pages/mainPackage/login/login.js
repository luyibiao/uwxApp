var filter = require("../../../utils/helpers/filter.js");
var storage = require("../../../utils/helpers/storage.js");
const auth=require("../../../utils/helpers/auth.js");

Page({
  data: {
    telFlag:false,
    codeFlag:false,
    btnDisable:true,
    codeDisable: false,
    popFlag:false,
    tel:'',
    code:'',
    times:"",
    content:"",
    iconUrl:[],
    modal:{
      modalShow:false
    }
  },

  onLoad(){
    this.setIconUrl();
    storage.removeStorage("SHOP_INFO")
    auth.checkAuth(()=>{
      this.setData({
        "modal.modalShow":true
      })
    });
  },
  onShow() {
    wx.login({
      success(res) {
        getApp().params.loginInfo["code"] = res.code;
      }
    })
  },
  onReady(){
    
  },
  //设置图标地址
  setIconUrl(){
    const imgurl = getApp().hep.imgurl + "icon";
    this.data.iconUrl = [
      {
        phone: `${imgurl}/phone.png`
      },
      {
        code: `${imgurl}/check_code.png`
      },
      {
        wxIcon: `${imgurl}/wx_icon.png`
      },
    ]
    this.setData({
      iconUrl: this.data.iconUrl,
      content:"获取验证码"
    })
  },

  //手机输入框输入事件  
  telInputFn(e){
    this.checkTel(e) ? this.setData({ telFlag: true }) : this.setData({ telFlag: false})
    this.setBtnStatus();
  },

  //验证码输入框事件
  codeInputFn(e){
    this.data.code=e.detail.value;
    this.setBtnStatus();
  },

  //获取验证码
  getCodeFn(){
    if(!this.data.telFlag){
      return;
    }
    if (!this.data.codeDisable) {
      this.setData({ codeDisable: true });
      this.getCode();
    }
  },
 
  getCode(){
    getApp().http({
      url: "sms/open/appLogin",
      data:{
        phone: this.data.tel
      }
    }).then(res=>{
      this.startTime();
    })
  },

  //验证码开始倒计时
  startTime(){
    let seconds = 60;
    let _this = this;
    this.setData({
      times: seconds + "s",
      codeFlag: true,
    })
    let timer = setInterval(function () {
      seconds--;
      _this.data.times = seconds + "s"
      if (seconds <= 0) {
        clearInterval(timer);
        _this.setData({ content: '重新发送', codeFlag: false, codeDisable: false })
      }
      _this.setData({ times: _this.data.times })
    }, 1000)
  },

  //登录
  onLoginFn() {
    getApp().hep.dig();
    getApp().http({
      url: "login/open/checkSms",
      data: {
        phone: this.data.tel,
        code:this.data.code
      },
      custom:true
    }).then(res => {
      this.loginRoute(res);
    })
  },

  showPopupFn() {
    this.setData({
      popFlag: true
    })
  },

  //弹出框回调
  onPopup(e) {
    this.data.popFlag = e.detail.popup
    this.setData({
      popFlag: false
    })
  },

  //按钮状态
  setBtnStatus(){
    let flag;
    if(this.data.telFlag && this.data.code!==""){
      flag=false;
    }
    else {
      flag=true
    }
    this.setData({
      btnDisable: flag
    })
  },
  
  //校验手机号
  checkTel(e){
    if (filter.tel(parseInt(e.detail.value))) {
      this.data.tel=e.detail.value;
      return true;
    }
    else {
      return false;
    }
  },

  //获取手机号
  getPhoneNumber(e){
    let _this=this;
    // wx.login({
    //   success(res) {
    //     console.log(res);
    //     getApp().params.loginInfo["code"] = res.code;
        
    //   }
    // })
    _this.phoneNumberlogin(e);
  },

  //微信登录
  phoneNumberlogin(e){
    if (!e.detail.encryptedData) {
      return;
    }

    getApp().hep.dig();
    getApp().http({
      url:"wxUserInfo/open/appPhoneLogin",
      data:{
        appId: getApp().params.loginInfo["accountInfo"].miniProgram.appId,
        code: getApp().params.loginInfo["code"],
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      custom: true
    }).then(res=>{
      wx.hideLoading();
      this.loginRoute(res);
    })
  },

  //用户点击授权失败时
  onAuthUserInfo(){
    let _this=this
    this.setData({
      "modal.modalShow":false
    })
    wx.getUserInfo({
      success(){
       
        auth.checkAuth();
      },
      fail(){
        _this.setData({
          "modal.modalShow": true
        })
      }
    })
  },

  //登录请求后处理逻辑
  loginRoute(res){
    if (res.httpCode == 200) {
      storage.setUserInfo(res.data);
      let url = storage.getStorage("GO_PAGE") || "";
      getApp().hep.getScene("scene", { type: "rech", url: url });
    }
    else {
      getApp().hep.dig({
        type: "st",
        icon: "error",
        title: res.msg
      })
    }
  }
})