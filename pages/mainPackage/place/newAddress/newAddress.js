const storage=require("../../../../utils/helpers/storage.js");
const filter=require("../../../../utils/helpers/filter.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region:[],
    form:{
      id:"",
      phone: '',
      name: '',
      sex: '',
      regionalId: '',
      regionalDesc: '',
      detail: '',
      longitude: '',
      latitude: '',
      def: '0',
      village: '',
      area: ''
    },
    address:{},
    resultMap:{},
    districtName:"",
    userInfo:{}
  },

  onLoad: function (options) {
    getApp().hep.callback(()=>{
      if(options.address){
        this.data.address = JSON.parse(options.address);
        this.initAddress()
      } else if (options.resultMap){
        this.data.resultMap = JSON.parse(options.resultMap || "{}");
        this.init()
      }else{
        let userInfo = storage.getUserInfo();
        this.setData({
          // "form.name": userInfo.name,
          "form.phone": userInfo.phone,
          "form.sex": userInfo.sex || 1
        })
      }
      
      
    },this.route)
    
  },

 
  onReady: function () {

  },
  init(){
    let obj = this.data.resultMap
    let userInfo = storage.getUserInfo();
    let Arr = [obj.province, obj.city, obj.district]
    this.setData({
     
      "form.name": userInfo.name,
      "form.phone":userInfo.phone,
      "form.sex":userInfo.sex || 1,
      "form.longitude": obj.lng,
      "form.latitude": obj.lat,
      "form.regionalId": obj.adcode,
      "form.regionalDesc": `${obj.province} ${obj.city} ${obj.district}`,
      "form.village": obj.name,
      "form.detail": `${obj.name}`,
      "form.site": obj.address
    })
  },
  initAddress(){
    let obj = this.data.address;
    let arr = obj.detail.trim().split(" ");
    this.setData({
      "form.id":obj.id,
      "form.name": obj.name,
      "form.phone": obj.phone,
      "form.sex": obj.sex || 1,
      "form.longitude": obj.longitude,
      "form.latitude": obj.latitude,
      "form.regionalId": obj.regionalId,
      "form.regionalDesc": obj.regionalDesc,
      "form.village": arr.length > 1 ? arr[0] : obj.detail,
      "form.detail": arr.length > 1 ? arr[0] : obj.detail,
      "form.site": obj.regionalDesc,
      "form.area": arr.length > 1 ? arr[1] : '',
      "form.def": parseInt(obj.def)
    })
  },
  bindRegionChange(e){
    this.setData({
      region:e.detail.value
    })
  },

  radioChangeSex(e){
    this.addForm("sex", e.detail.value)
  },
  inputEvent(e){
    let type=getApp().hep.dataset(e,"type");
    this.addForm(type, e.detail.value)
    // let form=this.data.form;
    // form[type]=e.detail.value;
    // let str=`form.${type}`
    // let obj={
    //   str: e.detail.value
    // }
    // this.setData(obj)
   
  },
  addForm(key,value){
    let form=this.data.form
    form[key] = value;
  },
  onSave(){
    this.data.form.detail=`${this.data.form.village} ${this.data.form.area}`
    if(!this.data.form.area){
      this.errModal("请填写门牌号")
      return;
    }
    if (!this.data.form.village) {
      this.errModal('请填写详细地址')
      return;
    }
    if (!this.data.form.name) {
      this.errModal("请填写姓名")
      return;
    }
    if(!this.data.form.sex){
      this.errModal('请填写性别');
      return;
    }
    if(!this.data.form.phone){
      this.errModal('请填写手机号')
      return;
    }
    if(!filter.tel(this.data.form.phone)){
      this.errModal("手机号格式不对")
      return;
    }
    getApp().hep.dig()
    getApp().http({
      url: this.data.form.id ? "address/update": "address/add",
      data:this.data.form
    }).then(res=>{
      getApp().hep.dig({
        type:"st",
        title:"添加成功",
        url:1,
        toType:"navback"
        
      })
    })
  },

  errModal(title){
    getApp().hep.dig({
      type:"st",
      title:title,
      icon:"error"
    })
  },
  changeSex(e){
    this.setData({
      "form.sex": getApp().hep.dataset(e, 'type')
    })

  },
  switch1Change(e){
    let def = this.data.form.def == '1' ? '0' : '1';
    this.setData({
      "form.def": def
    })
  },
  openMap(){
    getApp().hep.toRoute("navgo", "/pages/mainPackage/place/map/map")
  },
  onDelete(e) {
    let _this = this
    getApp().hep.dig({
      type: "sm",
      content: "是否删除",
      success(res) {
        if (res.confirm) {
          getApp().http({
            url: "address/delete",
            data: {
              id: _this.data.form.id
            }
          }).then(res => {
            getApp().hep.dig({
              type: 'st',
              title: '删除成功',
              url: 1,
              toType: "navback"
            })
          })
        }
      },
      fail() {

      }
    })
  }
})