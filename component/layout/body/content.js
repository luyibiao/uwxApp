const methods=require("../../../utils/helpers/methodser.js");
Component({
  externalClasses: ['my-content-class'],
  options: {
    multipleSlots: true, // 多slot支持
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isContetnFotter:{
      type:Boolean,
      value:true
    }
  },
  attached() {
    const imgurl = getApp().hep.imgurl;
    this.setData({
      imgurl: `${imgurl}delimg/autograph.png`,
    })
  },
  data: {
    imgurl: "",
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toHomePage() {
      getApp().hep.toRoute("navgo", "/pages/mainPackage/webview/webview")
    }
  }
})
