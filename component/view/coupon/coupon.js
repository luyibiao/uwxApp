// component/view/coupons/coupon.js
const storage = require("../../../utils/helpers/storage.js");
const methods=require("../../../utils/helpers/methodser.js");
const imgurl = getApp().hep.imgurl;
Component({
  options: {
    
    addGlobalClass: true,
    
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isStartLocate: {
      type: Boolean,
      value: false,
      observer(newval, oldval) {
        if (newval) {
          this.checkCardStatus();
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeIcon: imgurl + 'icon/tiem.png',
    screenWidth:"",
    detail:[],
    show:false,
    userInfo:{},

  },

  /** 
   * 组件的方法列表
   */
  methods: {
    checkCardStatus() {

      // 1 为需要更新的状态
      if ((!storage.getStorage("cardStatus") || storage.getStorage("cardStatus") == 1) && storage.getUserInfo()) {
        this.cardCheck(storage.getCityInfo().id);
        if (this.data.userInfo.phone === undefined) {
          
          this.setData({
            userInfo: storage.getUserInfo()
          })
        }
      }
    },

    //初始化城市会员卡
    cardCheck(cityId) {
      if (!cityId) {
        console.log("cardCheck no cityId");
        return;
      }

      getApp().http({
        url: "card/check",
        data: { "cityId": cityId }
      }).then(res => {
        let data = JSON.parse(res.data || null);
        if (data){
          //获取用户设备信息，屏幕宽度
          wx.getSystemInfo({
            success: res => {
              this.setData({
                screenWidth: res.screenWidth
              })
            }
          })

          this.setData({
            detail: data,
            show: true
          })
        }
       
      })
      // 已检查
      this.updateCardStatus(2);
    },

    updateCardStatus(type) {
      storage.setStorage("cardStatus", type ? type : 1);
    },
    closeModal(){
      this.setData({
        show:false
      })
    },
    openUserCoupon(){
      this.setData({
        show:false
      })
      getApp().hep.toRoute("navgo", "/pages/mainPackage/user/userCoupon/userCoupon")
    }
  }
})
