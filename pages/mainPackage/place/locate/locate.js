const wc=require("../../../../utils/config/wxConfig.js");
const mutations=require("../../../../utils/helpers/mutations.js");
const storage=require("../../../../utils/helpers/storage.js");
const methods=require("../../../../utils/helpers/methodser.js");
const imgurl = getApp().hep.imgurl

Page({

  data: {
    cityList:[],
    cityMsg:"定位中...",
    locateFlag:"",
    locationIcon:"",
    locateFlagNum:1,
    icon: imgurl + 'icon/u_icon-location.png',
    // isopenFlag:false
  },

  onLoad: function (options) {
      this.getCityList();
  },

  /**
   * 获取当前定位
   */
  setLocateCity(){
    let _this=this;
    wc.getWxLocation((res) => {
      _this.locationg(res);
    }, () => {
      _this.setLocateMsg();
     }).getAddress()
  },

  //重新定位
  onAgainLocation(){
    this.setLocateCity();
  },

  //得到当前定位城市
  locationg(data){
    if(data){
      let city = data.address_component.city
      let locateFlag = this.selectCity(city);
      this.setData({
        cityMsg: city,
        locateFlag: locateFlag
      })
     
    }
    else{
      this.setLocateMsg();
    }
  },

  //获取城市列表
  getCityList(){
    methods.geOpenCityList((data)=>{
      this.setData({
        cityList: data
      })
      this.setLocateCity()
    })
  },

  //校验定位城市是否开通
  selectCity(name){
    let list = this.data.cityList;
    let index=-1;
    for (let i = 0; i < list.length;i++){
      if (list[i].name.includes(name) || name.includes(list[i].name)){
        index=i;
        break;
      }
    }
    return index;
  },

  //选择城市
  onChoice(event){

    let cityInfo = getApp().hep.dataset(event,"item");
    this.updateCityInfo(cityInfo)
    // mutations.updateCity(cityInfo);
    // storage.setStorage("LOCATEfLAG", { repeatFlag: this.data.locateFlagNum, name: this.data.cityMsg, isopenFlag: true })
    // // storage.setStorage("LOCATEfLAG", { repeatFlag: this.data.locateFlagNum, name: "武汉", isopenFlag: true })
    // getApp().hep.toRoute("swtab",'/pages/mainPackage/tabbar/index/index')
  },

  //选择定位城市
  onChoiceLocate(){
    let list = this.data.cityList;
    for (let i = 0; i < list.length; i++) {
      if (list[i].name.includes(this.data.cityMsg) || this.data.cityMsg.includes(list[i].name)) {
        this.updateCityInfo(list[i])
        break;
      }
    }
  },

  //更新城市缓存信息
  updateCityInfo(info){
    mutations.updateCity(info);
    storage.setStorage("LOCATEfLAG", { repeatFlag: this.data.locateFlagNum, name: this.data.cityMsg, isopenFlag: true })
    let page = storage.getStorage("GO_PAGE") ? storage.getStorage("GO_PAGE") : "/pages/mainPackage/tabbar/index/index";
    getApp().hep.toRoute("rech", page)
  },
  

  //用户拒绝授权以后
  setLocateMsg(){
    this.setData({
      locateFlagNum:0,
      locateFlag:-2,
      cityMsg: "获取城市失败"
    })
  },
})