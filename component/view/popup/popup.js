// component/view/popup/popup.js
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    popup:{
      type:Boolean,
      observer(newval,oldval){
        this.setData({
          wrapShow: !newval,
        })
      }
    },
    popstyle:{
      type:null,
      observer(newval,oldval){
        
        this.setData({
          popstyle1:newval
        })
      }
    },
  },

  pageLifetimes: {
    hide: function () { 
      this.triggerEvent("onPopup", { popup: false })
    },
  },

  data: {
    popstyle1:"",
    wrapShow:true,
  },

  methods: {
    closePop(){
      this.setData({
        popup:false
      })
      this.triggerEvent("onPopup", { popup: false})
    },
  }
})
