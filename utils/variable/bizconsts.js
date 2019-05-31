
/**
 * 场景值
 */
const MAIN_SCENE = 1001;//发现栏小程序主入口
const CODE_SCENE = 1011;//扫描二维码
const WXVIEW_SCENE = 1089;//微信聊天主界面下拉

const scene={
  MAIN_SCENE,
  CODE_SCENE,
  WXVIEW_SCENE
}

/**
 * 缓存键
 */
const USER_INFO ="USER_INFO";//用户信息
const COUBORD_INFO ="COUBORD_INFO"//智柜信息
const MERC_INFO="MERC_INFO"//商户信息
const CITY_INFO ="CITY_INFO"//城市信息
const SHOP_INFO="SHOP_INFO"//商品信息

const storage={
  USER_INFO,
  COUBORD_INFO,
  MERC_INFO,
  CITY_INFO,
  SHOP_INFO
}

/**
 * 柜子操作模式
 */
const ORDER=1 //下单
const CLOTHING=2 //取衣
const CLOAK=3 //存衣

const coubord={
  ORDER,
  CLOTHING,
  CLOAK
}

/**
 * 分页大小
 */
const pageSz={
  PAGE_SIZE : 10,
  PAGE_SIZE20 : 20,
  PAGE_SIZE30 :30,
}

/**
 * 图片地址
 */
const IMG_URL = "https://cdn.ukaocloud.cn/wxapp/"

/**
 * 折扣类型
 */
const disType={
  MEMBER:1,//会员折扣
  CUSTORM:2,//自定义折扣
  NONEDIS:3,//无任何折扣
}

//下单模式
const orderMode={
  BESPOKE_MODE:1,//预约模式
  PAY_MODE:2,//下单支付模式
  ROOR_MODE:3,//一键下单模式
  CABINET_MODE:4,//预约智柜模式,
  CURRENT_MODE:0,//当前下单模式
}

//取送方式
const TS_WAY={
  TS_SELF:"SELF",//自营
  TS_SF:"SF",//顺丰
}


//客服电话
let SERVICE_TEL

module.exports={
  scene,
  storage,
  coubord,
  pageSz,
  IMG_URL,
  disType,
  SERVICE_TEL,
  orderMode,
  TS_WAY
}