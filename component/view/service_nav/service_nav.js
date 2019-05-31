
Component({
  properties: {
    isStartFlag:{
      type:Boolean,
      observer(newval,endval){
        if(newval){
          this.getMercBusiness();
        }
      }
    },
    dataquery:{
      type:null,
      value:"",
      observer(newval,endval){
        if(newval){
          this.data.checkDelItem=newval;
        }
      }
    }
  },

  data: {
    navList:[],
    checkDelItem:"",//所选择大类的id
    businessList:[],
    selectItem:"",//所选择子类的id
    placeIndex:0,//要控制的线条位置
    mercBusinessId:""
  },
  ready(){

  },
  methods: {
    //得到商品大类
    getMercBusiness() {
      getApp().http({
        url: "mercBusiness/open/list",
      }).then(res => {
        let list=res.data.list;
        this.data.mercBusinessId = list[0].id
        for(let i=0;i<list.length;i++){
          if (list[i].businessId==this.data.dataquery){
            this.data.placeIndex=i;
           
            this.data.mercBusinessId = list[i].id;
            break;
          }
        }
        this.setData({
          navList: list,
          placeIndex: this.data.placeIndex
        })
        this.data.checkDelItem = this.data.checkDelItem ? this.data.checkDelItem : res.data.list[0].businessId
        this.getBusinesssList();
      })
    },

    // 获取服务类别列表
    getBusinesssList() {
      getApp().http({
        url: 'business/product/type/list',
        data: {
          businessId: this.data.checkDelItem
        }
      }).then(res=>{
        this.setData({
          businessList:res.data,
          selectItem: res.data.length>0 ? res.data[0].id : ""         
        })
        this.triggerEvent("onchangeService", { parentId: this.data.checkDelItem, childrenId: this.data.selectItem, mercBusinessId: this.data.mercBusinessId})
      })
    },

    //选择服务项大类
    onmercBusiness(e){
      this.data.checkDelItem = e.detail.query.businessId;
      this.data.mercBusinessId=e.detail.query.id;
      this.getBusinesssList();
    },

    //选择服务项价目表
    onSelectBusiness(e){
      this.setData({
        selectItem: getApp().hep.dataset(e, "id")
      })
      this.triggerEvent("onchangeService", { parentId: this.data.checkDelItem, childrenId: this.data.selectItem, mercBusinessId: this.data.mercBusinessId})
    }
  }
})
