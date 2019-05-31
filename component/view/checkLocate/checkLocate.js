const storage = require("../../../utils/helpers/storage.js");
const wc = require("../../../utils/config/wxConfig.js");
const mutations=require("../../../utils/helpers/mutations.js");
const methods=require("../../../utils/helpers/methodser.js");
let cityList; //开通城市列表
let locateCity;//定位城市
let cityName;//选择的城市
let type;
let isopenFlag=true;//储存选择城市是否已开通
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isStartLocate:{
      type:Boolean,
      value:false,
      observer(newval, oldval) {
        type=""
        if(newval){
          this.checkLocate();
        }
      }
    }
  },

  data: {
    modal:false,
    // iscancel:true,
    confirmText:"",
    html:'',
    styleJson:{
      divStart: "<div class='div-wrap'>",
      divEnd: "</div>",
      mb:"margin-bottom:15px;",
      ftBig:"font-size:20px;",
      ftSmall:"font-size:14px;",
      weight:"font-weight:500"
    }
  },

  methods: {
    // 得到坐标
    checkLocate(){
      let _this=this
      wc.getWxLocation((res) => {
        // locateCity = "武汉";
        locateCity = res.address_component.city;
        _this.getCityList()
      }).getAddress()
    },

    // 得到开通城市列表
    getCityList() {
      methods.geOpenCityList((data)=>{
        cityName = storage.getCityInfo().name;
        cityList=data;
        this.isOpenCity();
      })
    },

    //校验选择城市是否在开通城市之列
    isOpenCity() {
      let index = -1;
      for (let i = 0; i < cityList.length; i++) {
        if (this.checkOpen(cityName, cityList[i].name)) {
          index = i;
          // mutations.updateCity(cityList[i]);
          break;
        }
      }

      if(index>-1){
        this.isLocate();
      }
      else{
        isopenFlag=false
        this.digStr();
      }
    },

    //校验选择城市是否在定位里
    isLocate() {
     
      if (this.checkOpen(cityName, locateCity)) {
        this.callbackmodal(false);
        return;
      }
      else {  
        let storageLocatCity = storage.getStorage("LOCATEfLAG") ? storage.getStorage("LOCATEfLAG") : ""
        if ((storageLocatCity && this.checkOpen(locateCity, storageLocatCity.name)) || storageLocatCity.repeatFlag==0) {
          //如果是从定位页面进来且弹出过一次询问对话框或者定位不到城市的时候 直接返回
          return;
        }
       
        this.isLocateOpen();
      }
    },

    //定位城市是否开通
    isLocateOpen() {
      let index = -1
      for (let i = 0; i < cityList.length; i++) {
        if (this.checkOpen(locateCity, cityList[i].name)) {
          index = i;
          break;
        }
      }
      if (index > -1) {
        let sbg=this.data.styleJson
        let html = `${sbg.divStart}<p style="${sbg.mb}${sbg.ftSmall}">定位到您在</p>`;
        html += `<p style="${sbg.mb}${sbg.ftBig}"><strong>${locateCity}</strong></p>`;
        html += `<p style="${sbg.ftSmall}">是否切换至该城市?</p>${sbg.divEnd}`
        this.setData({
          iscancel: true,
          confirmText: "确定"
        })
        type="locate"
        this.showModal(html)
      }

      else{
        this.callbackmodal(false);
      }
    },

    //显示弹框
    showModal(html){
      this.setData({
        modal:true,
        html:html
      })
    },
    
    //点击取消按钮
    oncancel(){
      this.setData({
        modal:false
      })
      this.callbackmodal(false);
    },

    //点击确认按钮
    onconfirm(){
      this.callbackmodal(true);
    },

    //回调函数
    callbackmodal(flag){
      this.triggerEvent("callbackFn", { modal: flag})
      storage.setStorage("LOCATEfLAG", { repeatFlag: 1, name: locateCity, isopenFlag: isopenFlag})
      if(flag){
        if (type == 'close') {
          getApp().hep.toRoute("reto", "/pages/mainPackage/place/locate/locate")
        }
        if (type == 'locate') {
          for (let i = 0; i < cityList.length; i++) {
            if (this.checkOpen(locateCity, cityList[i].name)) {
              // storage.setCityInfo(cityList[i]);
              mutations.updateCity(cityList[i]);
              getApp().hep.toRoute("rech", "/pages/mainPackage/tabbar/index/index");
              break;
            }
          }
        }
      }
    },

    digStr(){
      let sbg = this.data.styleJson
      let html = `${sbg.divStart}<p style="${sbg.mb}${sbg.ftSmall}">当前选择城市 <strong style="${sbg.ftBig}">${cityName}</strong></p>`
      html += `<p style="${sbg.mb}${sbg.ftSmall}">尚未开通服务</p>`
      html += `<p style="${sbg.ftSmall}">请选择已开通的城市</p>`
      this.setData({
        iscancel: false,
        confirmText: "去选择"
      })
      type = "close";
      this.showModal(html);
    },
    checkOpen(fval, tval) {
      return methods.checkIncludes(fval, tval,"includes");
      // return (fval.includes(tval) || tval.includes(fval))
      }
    }
})
