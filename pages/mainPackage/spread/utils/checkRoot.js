



function getCompetence(fn) {

  // commit('setIsFriend', res.data.data.isFriend);
  // commit('setIsUserFriend', res.data.data.isUserFriend);
  
  getApp().http(
    {
      url: 'userInfo/friend'
    }
  ).then(res => {
    service(res.data.isFriend, res.data.isUserFriend,fn);
  })
}

function service(isFriend, isUserFriend,fn){
  if (isFriend == 1){
    if (isUserFriend == 1){
      if(fn && typeof fn=='function'){
        fn();
      }
      // getApp().hep.toRoute("navgo", "/pages/mainPackage/spread/index/index")
    }else{
      getApp().hep.toRoute("reto", "/pages/mainPackage/spread/plan/plan")
    }
  }else{
    getApp().hep.toRoute("rech", "/pages/mainPackage/tabbar/index/index")
  }
}

module.exports={
  getCompetence
}