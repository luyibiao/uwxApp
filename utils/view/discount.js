/**
 * 计算金额打折类型
 */
const storage=require("../helpers/storage.js");
const bizconsts=require("../variable/bizconsts.js");
const calculation=require("../helpers/calculation.js");
const mutations=require("../helpers/mutations.js");
let cardDetail;
let discount;
let callFn;

function countDiscount(){
  let shopInfo = storage.getShopInfo();
  let disMoney=0;
  let list=shopInfo['list']
  let proPriceDesc=[];
  let business=[];
  let isVip = cardDetail.isVip || 0;
  if(shopInfo.moneyInfo){
    delete shopInfo.moneyInfo
  }
  let vipDisMoney = 0; //享受会员价格总额
  for (let i = 0; i < list.length;i++){
    //会员折扣
    if (list[i].saleType == bizconsts.disType.MEMBER){
     
      disMoney += cardDiscount(list[i], isVip) * list[i].cnt;
      vipDisMoney += cardDiscount(list[i], 1) * list[i].cnt;
    //自定义折扣
    }else if (list[i].saleType == bizconsts.disType.CUSTORM){
     
      disMoney += customDiscount(list[i], isVip) * list[i].cnt;
      vipDisMoney += customDiscount(list[i], 1) * list[i].cnt;
    }
    else if (list[i].saleType == bizconsts.disType.NONEDIS){
      discount=100;
      let money = isVip && list[i].vipPrice ? list[i].vipPrice : list[i].price; //是否享受会员价
      disMoney += money * list[i].cnt;
      vipDisMoney += (list[i].vipPrice ? list[i].vipPrice : list[i].price) * list[i].cnt 
    }
    let proPriceDescObj={
      id:list[i].id,
      name: list[i].name,
      cnt: list[i].cnt,
      path: list[i].imgPath ? list[i].imgPath : "",
      price: list[i].price,
      vipPrice: list[i].vipPrice,
      discount: discount ? discount : 100,
      mercBusinessId: list[i].mercBusinessId,
      businessName: list[i].businessName,
      proTypeId: list[i].typeId,
      proServiceId: list[i].proServiceId,
      serviceName: list[i].serviceName,
      businessId: list[i].businessId
    }
    proPriceDesc.push(proPriceDescObj)

    let businessObj={
      id: list[i].businessId,
      name: list[i].businessName
    }
    business.push(businessObj)
  }

  disMoney = Math.round(disMoney);
 
  let hash={}
  business=business.reduce((item,next)=>{
    hash[next.id] ? '' : hash[next.id]=true && item.push(next);
    return item;
  },[])
  mutations.updateMoney(shopInfo, { disMoney, proPriceDesc, business, isVip, vipDisMoney }, callFn)
}

//计算会员卡打折折扣
function cardDiscount(item, isVip){
  let money = isVip && item.vipPrice ? item.vipPrice : item.price; //是否享受会员价
  //会员卡开通了折扣
  if (subStr()==1){
   
    const CURRENCY = 1 // 通用折扣
    const RUNTYPE = 2 //经营大类折扣
    
    if (cardDetail.discountType == CURRENCY){
      if (cardDetail.cardDiscount){
       
        discount = cardDetail.cardDiscount;
        return money * calculation.accDiv(cardDetail.cardDiscount,100)
      }
      else{
        return money;
      }
    }

    if(cardDetail.discountType==RUNTYPE){
      
      let discountDesc = JSON.parse(cardDetail.discountDesc);
      for (let i = 0; i < discountDesc.length;i++){
        if (discountDesc[i].bizId == item.businessId){
          discount = discountDesc[i].discount
          return money * calculation.accDiv(discountDesc[i].discount,100)
        }
      }
    }
  }else{
    return money;
  }
}

//计算自定义折扣
function customDiscount(item, isVip){
  let money = isVip && item.vipPrice ? item.vipPrice : item.price; //是否享受会员价
  discount = item.discount
  return money * calculation.accDiv(item.discount,100) * item.cnt;
}

function subStr(){
 
  return cardDetail.cardRights.charAt(1)
}

function queryCardDetail(fn){
  callFn=fn;
  getApp().http({
    url: 'card/detail'
  }).then(res=>{
    cardDetail = res.data
    countDiscount();
  })
}

module.exports={
  queryCardDetail
}