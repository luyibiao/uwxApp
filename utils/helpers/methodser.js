/**
 * 局部公共方法存放文件
 */

const storage=require("../helpers/storage.js");
const discount=require("../view/discount.js");
const bizconsts=require("../variable/bizconsts.js");

module.exports={
  //拨打电话
  callPhone(tel){
    wx.makePhoneCall({
      phoneNumber: tel,
      fail() {
        getApp().hep.dig({
          type: "st",
          title: '操作取消',
          icon: "none"
        })
      }
    })
  },

  //得到开通城市列表
  geOpenCityList(fn){
    getApp().http({
      url: "city/open/list"
    }).then(res => {
      if(fn && typeof fn=="function"){
        fn(res.data);
      }
    })
  },

  //得到城市缓存配置信息
  getConfigInfo(key){
    let cityInfo = storage.getCityInfo();
    return key ? cityInfo[key] : cityInfo;
  },

  //获取地址信息
  getAddresList(fn){
    getApp().http({
      url:"address/list",
      data:{}
    }).then(res=>{
      if(fn && typeof fn=='function'){
        fn(res);
      }
    })
  },

  //得到下单的经营大类和衣物列表
  getBussinessList(){
    let shopInfo = storage.getShopInfo();
    let proPriceDesc = JSON.stringify([...shopInfo.moneyInfo.proPriceDesc]);
    let business = JSON.stringify([...shopInfo.moneyInfo.business]);
    return { proPriceDesc, business}
  },

  //校验两个字符串是否相等
  checkIncludes(fval, tval,type){
    if(type){
      if (type =="includes"){
        return (fval[type](tval) || tval[type](fval))
      }
      if(type=="=="){
        return (fval==tval)
      }
      if(type==="==="){
        return (fval===tval)
      }
    }
  },

  //获取设备屏幕高度和宽度
  getWidthOrheight(){
    return { width: wx.getSystemInfoSync().windowWidth, height: wx.getSystemInfoSync().windowHeight};
  },

  //选择地址是否在取送范围内
  checkAddressOrTs(dataFrom,type){
    if (dataFrom.data || type != bizconsts.TS_WAY.TS_SELF){
      return true
    }
    getApp().hep.toRoute("navgo", "/pages/mainPackage/place/noOpenAddress/noOpenAddress")
  },

  //是否弹出过用户协议
  showUserProtocol(){
   
    if (!storage.getStorage('showProtocol')) {
        getApp().hep.toRoute("navgo", "/pages/mainPackage/user/userProtocol/userProtocol")
        storage.setStorage('showProtocol', 1)
    }
  },

  //将http转换成https
  replaceHttps(url){
    return url.replace("http","https")
  },

  //canvas绘制文字使换行
  drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引 
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分                
        initHeight += 15; //16为字体的高度                
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分                
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }        // 标题border-bottom 线距顶部距离        
    titleHeight = titleHeight + 10;
    // return titleHeight
  },

  //计算金额打着折扣并得到下单衣物列表
  discountMoney: discount.queryCardDetail,

}