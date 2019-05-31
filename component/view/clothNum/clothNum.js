// component/view/clothNum/clothNum.js
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {

  },

  data: {
    popup:false,
    current:1,
    createCnt:1,
    array:[],
   
  },
  attached(){
    let Arr=[]
    for(let i=0;i<30;i++){
      Arr.push(i+1);
    }
    this.setData({
      array:Arr
    })
  },
  methods: {
    onSeletNum(){
      this.setData({
        popup:true
      })
    },
    clothNumChange(e){
      this.data.current=e.detail.value[0]+1
    },
    onConfirm(){
     
      this.setData({
        popup: false,
        createCnt: this.data.current
      })
      this.triggerEvent('callback', { createCnt: this.data.createCnt})
    },
    onCancel(){
      this.setData({
        popup:false,
      })
      this.triggerEvent('callback', { createCnt:this.data.createCnt })
    },
  }
})
