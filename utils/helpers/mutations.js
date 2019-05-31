const storage=require("./storage.js")
const bizconsts =require("../variable/bizconsts.js")
// 更新城市信息
function updateCity(value) {
  let data = {
    id: value.id, //id
    name: value.name, //名称
    status: value.status, //状态
    latitude: value.latitude, //维度
    longitude: value.longitude, //经度
    createOrderEnable: value.createOrderEnable, //是否能下单
    closedTip : value.closedTip, // 关闭下单提示
    createMode: value.createMode, //下单模式
    onlyCupboard: value.onlyCupboard, //仅智柜下单模式
    isCupboard: value.isCupboard, //是否开启智柜
    bizStyle: value.bizStyle, //首页经营项目展方式
    isClientAdve: value.isClientAdve, //是否展示首页轮播图
    showBookCupboard: value.showBookCupboard, //是否展示首页智柜
    showOutsideLink: value.showOutsideLink, //是否展示首页外链菜单
    topOutsideLink: value.topOutsideLink, // 是否置顶外链
    showMedia: value.showMedia, // 是否显示图片及视频
    oneKeyCreate: value.oneKeyCreate, //是否开启一键下单,
    createStoreOrder: value.createStoreOrder, //是否允许自送门店下单,
    storeOrderEnable: value.storeOrderEnable, //是否开启自送门店下单,
    tel:value.tel,//客服电话
    upayEnable: value.upayEnable,//是否开通优付卡
  }
  if(!data.tel){ //获取服务电话
    let merc = storage.getMercInfo();
    bizconsts.SERVICE_TEL = merc.tel
  }
  else{
    bizconsts.SERVICE_TEL = data.tel
  }
  
  bizconsts.orderMode.CURRENT_MODE = data.onlyCupboard == 1 ? bizconsts.orderMode.CABINET_MODE  : data.createMode //获取下单模式

  
 
  storage.setCityInfo(data);
}

//更新下单商品信息 value为原始的值 othervalue为新增加的值
function updateMoney(value,otherValue,fn){
  let storageStr;

  storageStr = { ...value }
  storageStr["moneyInfo"] = { ...storageStr["moneyInfo"], ...otherValue}
  storage.setShopInfoSync(storageStr,()=>{
    if(fn && typeof fn=='function'){
      fn();
    }
  })
}

module.exports={
  updateCity,
  updateMoney
}
