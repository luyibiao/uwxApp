
Component({
  options: {
    multipleSlots: true, // 多slot支持
    addGlobalClass: true,
    
  },
  properties: {
    islink:{
      type:Boolean,
      value:false,
      observer(newval) {},
    },
    linkurl:{
      type:null,
      observer(newval) { 
        
      },
    },
    linktype:{
      type:String
    },
    cellstyle:{
      type:null
    }
  },

  data: {

  },

  methods: {
   
  }
})
