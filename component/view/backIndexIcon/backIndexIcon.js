const methods=require("../../../utils/helpers/methodser.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    backIndexStyle: {
      right: 10,
      bottom: 120,
      marX: 0,
      marY: 0
    },
    screenWidth: methods.getWidthOrheight().width,
    screenHeight: methods.getWidthOrheight().height
  },

  attached() {
    let list=getCurrentPages();
    const imgurl = getApp().hep.imgurl;
    this.setData({
      backIndexUrl: `${imgurl}icon/back_index.png`,
      showBackFlag: methods.checkIncludes(list[list.length - 1].route, "mainPackage/tabbar", "includes")
    })
  },


  /**
   * 组件的方法列表
   */
  methods: {
    movebtn(e) {
      let marX = 0;

      let clientX = e.touches[0].clientX;
      let clientY = e.touches[0].clientY;
      if (clientX - 20 <= 0 || clientX + 55 / 2 + 12 >= this.data.screenWidth) {
        return;
      }

      let right = this.data.backIndexStyle.right;
      let bottom = this.data.backIndexStyle.bottom;
      marX = clientX - (this.data.screenWidth + right - 55);

      this.setData({
        "backIndexStyle.marX": marX,

      })

    },
    onBtnBackIndex(){
      getApp().hep.toRoute("swtab","/pages/mainPackage/tabbar/index/index")
    }
  }
})
