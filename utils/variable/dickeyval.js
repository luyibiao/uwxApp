const imgurl = getApp().hep.imgurl 

module.exports={
  ORDER_PAY_STATUS: [
    { 'val': '0', 'text': '未支付' },
    { 'val': '1', 'text': '已支付' },
    { 'val': '2', 'text': '部分支付' },
    { 'val': '3', 'text': '部分退款' },
    { 'val': '4', 'text': '全部退款' }
  ],
  ORDER_STATUS: [
    { 'val': '1', 'text': '已下单，待接单' },
    { 'val': '3', 'text': '已接单' },
    { 'val': '5', 'text': '已收件' },
    { 'val': '7', 'text': '入库中' },
    { 'val': '9', 'text': '已入库' },
    { 'val': '20', 'text': '送往工厂途中' },
    { 'val': '23', 'text': '到工厂' },
    { 'val': '26', 'text': '洗涤中' },
    { 'val': '29', 'text': '已洗完' },
    { 'val': '32', 'text': '已出库' },
    { 'val': '35', 'text': '已出厂，派送中' },
    { 'val': '38', 'text': '已到门店，待送件' },
    { 'val': '41', 'text': '送件中' },
    { 'val': '44', 'text': '已回柜' },
    { 'val': '47', 'text': '已签收' },
    { 'val': '50', 'text': '已完成' },
    { 'val': '53', 'text': '已评价' },
    { 'val': '60', 'text': '已取消' },
    { 'val': '61', 'text': '已作废' },
    { 'val': '62', 'text': '交易关闭' },
    { 'val': '80', 'text': '修改入库' },
    { 'val': '81', 'text': '变更时间' },
    { 'val': '82', 'text': '修改订单总额' },
    { 'val': '83', 'text': '指派取送员' }
  ],
  EXPRESS_TYPE: [
    { 'val': 'SELF', 'text': '自营' },
    { 'val': 'SF', 'text': '顺丰' }
  ],
  TSWAY_LIST:[
    { name: "上门取件", imgPath: `${imgurl}shop/item/visit.png` , url:"", isShow:1 },
    { name: "自送智能柜", imgPath: `${imgurl}shop/item/self.png`, url: "", isShow: 0 },
    { name: "自送门店", imgPath: `${imgurl}shop/item/store.png`, url: "", isShow: 1 },
  ]
}