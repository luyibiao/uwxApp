// component/view/homePhoto/homePhoto.js
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    mediaList: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    images: {}
  },
  lifetimes: {
    ready () {
      this.videoContext = wx.createVideoContext('myVideo')
    }
  },
  methods: {
    bindplay: function () {
      // this.videoContext.play()
      console.log(1321321)
    },
    bindpause: function () {
      this.videoContext.pause()
    },
    imageLoad (e) {
      var $width = e.detail.width,    //获取图片真实宽度
        $height = e.detail.height
      var image = this.data.images;
      //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
      image[e.target.dataset.index] = {
        width: $width,
        height: $height
      }
      this.setData({
        images: image
      })
    },

    onSelectImage (item) {
      let appLink = getApp().hep.dataset(item, 'applink')
      if (appLink) {
        let type = "navgo"
        if ((appLink.search(/http/i) || appLink.search(/https/i)) > -1) {
          getApp().hep.toRoute(type, `/pages/mainPackage/webview/webview?src=${appLink}`)
          return
        }
        let list = appLink.split("/")
        if (list.includes('index') || list.includes('order') || list.includes('personal')) {
          type = "swtab"
        }
        getApp().hep.toRoute(type, `/${appLink}`)
      }
    }
  }
})
