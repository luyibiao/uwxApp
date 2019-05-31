const storage=require("./storage.js");
//校验是否授权
function checkAuth(fn){
  if (getApp().params.authFlag) {
      authorization(fn);
    // checkauthorization();
  }
}

//授权
function authorization(fn){
 
  wx.getUserInfo({
    success(res) {
      saveAuth(res)
    },
    fail(res) {  
      if(fn && typeof fn=="function"){
        fn(); 
      }
    }
  })
}

//保存授权数据
function saveAuth(res){
  getApp().hep.dig();
  
  getApp().http({
    url: 'wxUserInfo/open/saveAppInfo',
    data: {
      nickname: res.userInfo.nickName,
      avatarUrl: res.userInfo.avatarUrl,
      gender: res.userInfo.gender,
      province: res.userInfo.province,
      city: res.userInfo.city,
      country: res.userInfo.country
    }
  }).then(res => {
    wx.hideLoading();
  })
}

module.exports={
  checkAuth
}