/**
 * 弹出框api封装
 */

function setContent(obj,key,dfl){
  return obj[key] = obj[key] ? obj[key] : dfl;
}

function isToRoute(option){

  if (option.url || option.time){
    option.tiem = option.time ? option.time : 1000;
    option.toType = option.toType ? option.toType : "navgo";
    setTimeout( ()=>{
      getApp().hep.toRoute(option.toType, option.url);
    }, option.tiem);

  }

}

module.exports={
  showDig(option={}){
    let dtype = option.type;
    option.mask!==undefined ? "" : setContent(option, "mask", true)
    switch (dtype){
      case "sm"://显示模态对话框
        option.content ? "" : setContent(option, "content", "无")
        wx.showModal(option);
        isToRoute(option);
        break;
        
      case "st"://显示消息提示框
        option.title ? "" : setContent(option, "title", "成功");
        option.icon === "error" ? option.image ="/static/img/close.png" : option.icon;
        wx.showToast(option);
        isToRoute(option);
        break;

      case "ht"://隐藏消息提示框
        wx.hideToast(option);
        break;

      case "sl"://显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
        option.title ? "" : setContent(option, "title", "加载中")
        wx.showLoading(option);
        isToRoute(option);
        break;

      case "hl"://隐藏 loading 提示框
        wx.hideLoading(option);
        break;

      case "sa"://显示操作菜单
        wx.showActionSheet(option);
        isToRoute(option);
        break;
        
      default :
        option.title ? "" : setContent(option, "title", "加载中")
        wx.showLoading(option)
        break;
    }
  }
}