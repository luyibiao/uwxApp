/**
 * 接口存放及基础配置文件
 */
const LOCAL_ENV ="http://10.0.0.13:8081/" //本地环境

const TEST_ENV = "http://wx.ukaocloud.cn/uk_api/" //测试环境

const PRO_ENV ="https://w.twash.cn/uk_api/" //正式环境


const W_XU = "wxu/"

const baseuRL = TEST_ENV
//  const baseuRL = LOCAL_ENV
// const baseuRL = PRO_ENV

const API_URL = baseuRL+W_XU


module.exports={
  API_URL,
}