// component/view/nav/nav.js
Component({
  // options: {
  //   addGlobalClass: true,
  // },
  properties: {
    navList:{
      type:null,
      value:[],
      observer(newval, oldval) {
        let _this=this;
        if(!oldval) return;
        if(oldval.length>0) return;
        if(newval.length>0 ){
          setTimeout(function () {
            _this.setStorkeStyle();
          }, 10)
        }
      }
    },

   

    //开始选中第几项
    selected:{
      type:null,
      value:0,
    },

    //自定义样式
    navstyle:{
      type:null
    }
  },

  data: {
    animationData:{},
    classObj:{},
    active:0
  },

  methods: {
    navBtn(event){
      let animation=wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
      })
      
      animation.left(event.currentTarget.offsetLeft).step()
      let dataset={
        selected: getApp().hep.dataset(event, "select"),
        query: getApp().hep.dataset(event, "item")
      }
      this.data.selected = getApp().hep.dataset(event,"select");
      this.setData({
        animationData: animation.export(),
        selected: this.data.selected
      })
      this.triggerEvent("navBtn", dataset)
    },
    setStorkeStyle(){
      var _this = this;
      var obj = wx.createSelectorQuery();
      obj.in(this).selectAll(".nav").boundingClientRect(function (res) {
        _this.data.classObj = {
          width: res[0].width,
          left: res.length >= 2 ? _this.data.selected * res[1].left : 0
          // left:0
        }
        _this.setData({
          classObj: _this.data.classObj
        })
      }).exec();
    }
  }
})
