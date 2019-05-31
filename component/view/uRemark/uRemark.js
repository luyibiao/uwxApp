// component/view/userMark/userMark.js
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {

  },

 
  data: {
    textArea: {
      showTextArea: false,
      userRemark: ""
    },
  },
  methods: {
    onShowTextArea() {
      this.setData({
        "textArea.showTextArea": true
      })
    },
    onBindBlur(e) {
      // this.assignment(this.data.textArea)
      this.setData({
        "textArea.showTextArea": false,
        "textArea.userRemark": e.detail.value
      })
      this.triggerEvent("callback", this.data.textArea);
    },
  }
})
