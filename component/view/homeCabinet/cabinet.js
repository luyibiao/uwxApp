// component/view/cabinet/cabinet.js
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    cabinetList: {
      type: null,
      observer() {}
    }
  },

 
  data: {

  },

  
  methods: {
    onBespeak(){
      getApp().hep.toRoute("navgo","/pages/mainPackage/creationOrder/cupboardOrder/cupboardOrder")
    }
  }
})
