const methods=require("../../../utils/helpers/methodser.js")

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    //是否显示弹框
    ismodal: {
      type: Boolean,
      value: true,
      observer(newval, oldval) { }
    },

    //传入的弹框内容
    content: {
      type: null,
      value: ''
    },

    //是否点击蒙板消失弹框
    //true为点击不消失
    //false为消失，但是要定义点击蒙板事件，来改变ismodal值
    isonMask: {
      type: Boolean,
      value: false,
      observer(newval, oldval) { }
    },

    //是否显示取消按钮
    iscancel: {

      type: Boolean,
      // value:true,
      observer(newval, oldval) {
        this.setData({
          iscancel: newval ? newval : oldval
        })
      }
    },

    //是否显示确认按钮
    isconfirm: {

      type: Boolean,
      // value:true,
      observer(newval, oldval) {
        this.setData({
          isconfirm: newval ? newval : oldval
        })
      }
    },

    //取消按钮的文字
    cancelText: {
      type: String,
      value: "取消",
      observer(newval, oldval) {
        this.setData({
          cancelText: newval ? newval : oldval
        })
      }
    },

    //确认按钮的文字
    confirmText: {
      type: String,
      value: "确认",
      observer(newval, oldval) {
        this.setData({
          confirmText: newval ? newval : oldval
        })
      }
    },

    //模态框样式
    modalStyle: {
      type: null
    },

    //蒙板样式
    maskStyle:{
      type:null
    }
  },


  data: {
    width: methods.getWidthOrheight().width % 2 == 0 ? methods.getWidthOrheight().width : methods.getWidthOrheight().width+1,
    height: methods.getWidthOrheight().height % 2 == 0 ? methods.getWidthOrheight().height : methods.getWidthOrheight().height + 1,
  },

  

  methods: {
    cancelmodal() {
      this.triggerEvent("onCancelFn")
    },
    confirmmodal() {
      this.triggerEvent("onConfirmFn")
    },
    onCloseMask() {
      if (this.properties.isonMask) {
        return;
      }
      this.setData({
        ismodal: false
      })
      this.triggerEvent("onMaskFn")
    }
  }
})
