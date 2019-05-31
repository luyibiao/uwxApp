const methods=require("../../../../utils/helpers/methodser.js");
const wc=require("../../../../utils/config/wxConfig.js");
const imgurl = getApp().hep.imgurl
Page({
  data: {
    selectName:"",
    mapFlag:true,
    locImg: imgurl +"icon/u_icon_loc.png",
    torightImg: imgurl + "icon/to-right.png",
    height: methods.getWidthOrheight().height,
    center:{
      latitude: 28.216004,
      longitude: 112.880701
    },
    resultMap:{
      lng: "",
      lat: "",
      address: "", 
      name: "", 
      province: "", //省
      city: "", //市
      district: "",  //区
      // citycode: "", //地方邮编
      adcode: "",
      street:"",
      streetNumber: "",
      // township: ""
    },
    startFlag:false,
    keyWords:"",
    searchBtnList:[]
  },

  onLoad: function (options) {
    getApp().hep.callback(()=>{
      //let data = options.data  ? JSON.parse(options.data) : '';
      this.loadFn()
    }, this.route)
  },

  onReady: function () {

  },

  onShow: function () {

  },

  loadFn(data){
    this.mapCtx = wx.createMapContext('myMap');
    this.getMapAddress(data);
  },

  regionchange(e){
  
    let _this = this
    if (e.type == 'end' && e.causedBy=='drag'){
      this.mapCtx.getCenterLocation({
        success(res){
          _this.getMapAddress(res);
        }
      })
    }
  },

  //得到详细地址
  getMapAddress(data){
    let _this=this
    if (data){
      _this.setCenterOrMark(data)
    }else{
      wc.getWxLocation((res) => {
        _this.setCenterOrMark(res)
      }, () => { }).getAddress(data)
    }
  },

  //设置中心点坐标
  setCenterOrMark(data){
    this.setData({
      "center.latitude": data.location.lat,
      "center.longitude": data.location.lng,
      "resultMap.name": data.formatted_addresses.recommend,
      "resultMap.address":data.address,
      "resultMap.lng": data.location.lng,
      "resultMap.lat": data.location.lat,
      "resultMap.province": data.address_component.province,
      "resultMap.city": data.address_component.city,
      "resultMap.district": data.address_component.district,
      "resultMap.adcode": data.ad_info.adcode,
      // "resultmap.citycode": data.ad_info.city_code,
      
      //"resultMap.street": data.address_component.street,
      //"resultMap.streetNumber": data.address_component.street_number ,
      // "resultMap.township": data.address_component.street_number
    })
    
  },
  openSelect() {
    getApp().hep.toRoute("navgo", "/pages/mainPackage/place/map/select/select")
  },

  onConfirm(){

    let pages = getCurrentPages();

    let prevPage = pages[pages.length - 2];

    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      "form.longitude": this.data.resultMap.lng,
      "form.latitude": this.data.resultMap.lat,
      "form.regionalId": this.data.resultMap.adcode,
      "form.regionalDesc": `${this.data.resultMap.province} ${this.data.resultMap.city} ${this.data.resultMap.district}`,
      "form.village": this.data.resultMap.name,
      "form.detail": `${this.data.resultMap.name}`,
      "form.site": this.data.resultMap.address
    }); 

    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    });

    //getApp().hep.toRoute("navgo", "/pages/mainPackage/place/newAddress/newAddress?resultMap=" + JSON.stringify(this.data.resultMap))
  },
  moveToLocation(){
    this.mapCtx.moveToLocation();
  }
 
 
})