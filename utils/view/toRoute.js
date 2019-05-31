
module.exports={
  toRoute: function (type, option) {
    if (option) {
      switch (type) {
        case "navback"://关闭当前页面，返回上一页面或多级页面
          checkRouteType(option) ? wx.navigateBack(option) : navBack(option);
          break;

        case "swtab"://跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
          checkRouteType(option) ? wx.switchTab(option) : swTab(option);
          break;

        case "navgo"://保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
          checkRouteType(option) ? wx.navigateTo(option) : navGo(option);
          break;

        case "rech"://关闭所有页面，打开到应用内的某个页面
          checkRouteType(option) ? wx.reLaunch(option) : rech(option);
          break;

        case "reto"://关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
          checkRouteType(option) ? wx.redirectTo(option) : reto(option);
          break;
          
        default:
          navGo(option);
          break;
      }
    }
    else {
      return;
    }
  }
}

function checkRouteType(option) {
  return typeof option === "object" ? true : false;
}

function navBack(option) {
  wx.navigateBack({
    delta: option,
    complete(res) {
     
    }
  })
}

function swTab(option) {
  wx.switchTab({
    url: option,
    complete(res) {
      
    }
  })
}

function navGo(option) {
  wx.navigateTo({
    url: option,
    complete(res) {
     
    }
  })
}

function rech(option) {
  wx.reLaunch({
    url: option,
    complete(res) {
    }
  })
}

function reto(option) {
  wx.redirectTo({
    url: option,
    complete(res) {
     
    }
  })
}

