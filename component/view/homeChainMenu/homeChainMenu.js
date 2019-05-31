// component/view/homeChainMenu/homeChainMenu.js
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    menuList: {
      type: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelectMenu (item) {
      let appLink = getApp().hep.dataset(item, 'applink')
      if (appLink) {
        if ((appLink.search(/http/i) || appLink.search(/https/i)) > -1) {
          getApp().hep.toRoute(type, `/pages/mainPackage/webview/webview?src=${appLink}`)
          return
        }
        let list = appLink.split("/")
        let type = "navgo"
        if (list.includes('index') || list.includes('order') || list.includes('personal')) {
          type = "swtab"
        }
        console.log(appLink)
        getApp().hep.toRoute(type, `/${appLink}`) 
      }
    }
  }
})
