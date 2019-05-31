const methods=require("../../../../utils/helpers/methodser.js");
const mutations=require("../../../../utils/helpers/mutations.js")
const storage=require('../../../../utils/helpers/storage.js')
Page({
  data: {
    img:{
      deleteUrl:"",
      iconCheck:"",
      iconEdit: ""
    },
    addresList:[],
    active:0,
    type:0,
  },

  onLoad: function (options) {
    this.data.type = options.type ? options.type : 0
  },

  onShow(){
    getApp().hep.callback(() => {
      this.init();
      this.loadFn();
    }, this.route)
  },

  init(){
    let imgUrl = getApp().hep.imgurl;
    this.setData({
      "img.deleteUrl": `${imgUrl}icon/u_icon_delete.png`,
      "img.iconCheck": `${imgUrl}icon/u_icon_check.png`,
      "img.iconEdit": `${imgUrl}icon/u_icon_edit.png`
    })
  },
  loadFn(){
    methods.getAddresList((res)=>{
      this.setData({
        addresList: res.data
      })
    })
  },
  onDef(e){
    let item=getApp().hep.dataset(e,"item");
    let index=getApp().hep.dataset(e,"index");
    this.setData({
      active:index
    })
    
    getApp().http({
      url:'address/updateDefault',
      data:{
        id:item.id
      }
    }).then(res=>{
      getApp().hep.dig({
        type:"st",
        title:"设置成功"
      })
      this.setData({
        active:0
      })
      this.loadFn();
    })
  },

  onSelect(e){
    if(this.data.type==1){
      let item = getApp().hep.dataset(e, 'item');
      let shopInfo = storage.getShopInfo();
      let _this = this;
      mutations.updateMoney(shopInfo, { orderAddres: item }, () => {
        getApp().hep.toRoute('navback', 1)
      })
    }
  },

  onAdd(){
    getApp().hep.toRoute("navgo","/pages/mainPackage/place/map/map")
  },

  onNewAddress(e){
    let item = getApp().hep.dataset(e,"item");
    let data = "";
    if(item){
      let json = JSON.stringify(item);
      data="?address="+json;
    }
    getApp().hep.toRoute("navgo", "/pages/mainPackage/place/newAddress/newAddress"+data);
  }
})