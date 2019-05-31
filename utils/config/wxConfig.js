const mapWx=require("../view/qqmap-wx-jssdk.js");
const wxa=wx;

/**
 * 获取地理位置 第一个参数接口调用成功回调函数，第二个失败回调函数
 */
function wxSetting(confirmFn, cancelFn) {
  this.confirmFn = confirmFn;
  this.cancelFn = cancelFn;
}
function getWxLocation(confirmFn, cancelFn){
  return new wxSetting(confirmFn, cancelFn); 
}
wxSetting.prototype={

  //得到地图对象
  getMapObj(){
    const key = 'FODBZ-M7TWU-MHXVF-BV6CP-NM6J5-7FBQM'
    return new mapWx({
      key: key
    })
  },

  //得到详细地址
  getAddress(coordinate,type){
    this.coordinate = coordinate;
    this.type=type
    let _this = this
    let qqmapsdk=this.getMapObj();
    if(_this.coordinate){
     
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: _this.coordinate.latitude,
          longitude: _this.coordinate.longitude
        },
        success(res) {
          _this.protoConfirmFn(res.result);
        },
        fail(res) {
          _this.protoCancelFn();
        }
      })
    }
    else{
    
      wx.getLocation({
        type: _this.type ? _this.type : "gcj02",
        success(res) {
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success(res) {
             
              _this.protoConfirmFn(res.result);
            },
            fail(res) {
              _this.protoCancelFn();
            }
          })
        
        },
        fail(res) {
        
          _this.showModal()
        }
      })
    }
   
  },
 
 //未授权时
  showModal(){
    let _this=this
    getApp().hep.dig({
      type: "sm",
      title: "获取位置",
      content: "通洗需要获取您的位置信息",
      confirmText: "去授权",
      success(res) {
        if (res.confirm) {
          _this.openWxSetting();
        }
        else if (res.cancel) {
          _this.protoCancelFn();
        }
      },
      fail(res) {
        _this.protoCancelFn();
      }
    })
  },

  //打开授权设置页
  openWxSetting(){
   let _this=this;
    wx.openSetting({
      success(res){
     
        _this.getAddress();
      },
      fail(){
      
        _this.protoCancelFn();
      }
    })
  },

  //搜索地址
  searchAddress(val){
    let qqmapsdk = this.getMapObj();
    let _this = this;
    qqmapsdk.search({
      keyword:val,
      success(res){
        _this.protoConfirmFn(res)
      }
    })
  },
  
  //成功回调函数
  protoConfirmFn(data){
    let _this=this
    if (_this.confirmFn && typeof _this.confirmFn == 'function') {
      _this.confirmFn(data);
    }
  },

  //失败回调函数
  protoCancelFn(){
   
    getApp().hep.dig({
      type:"st",
      title:"获取定位失败",
      icon:"error"
    })
    if (this.cancelFn && typeof this.cancelFn == 'function') {
      
      this.cancelFn();
    }
  }
}




//调用微信支付付款
function wxPay(option,successfn,failfn){
  wx.requestPayment({
    timeStamp: option.timeStamp,
    nonceStr: option.nonceStr,
    package: option.package,
    signType: option.signType,
    paySign: option.paySign,
    success(res){
      getApp().hep.dig({
        type:"st",
        title:"支付成功",
      })
      if(successfn && typeof successfn=="function"){
        successfn(res);
      }
    },
    fail(res){
      if (res.errMsg == "requestPayment:fail cancel") {
        getApp().hep.dig({
          type: "st",
          title: "支付取消",
          icon: "error"
        })
      }
      else {
        getApp().hep.dig({
          type: "st",
          title: "支付失败",
          icon: "error"
        })
      }
      if(failfn && typeof failfn=="function"){
        failfn(res);
      }
    }
  })
}


//授权保存图片到相册
function savaImage(id,confirmFn,failFn){
  wx.canvasToTempFilePath({
    canvasId:id,
    success(res){
      let fileUrl = res.tempFilePath;
      wx.saveImageToPhotosAlbum({
        filePath: fileUrl,
        success(resa){
          if (confirmFn && typeof confirmFn=='function' ){
            confirmFn();
            getApp().hep.dig({type:"st",title:"保存成功"})
          }
        },
        fail(resa){
          wx.getSetting({
            success(ress){
              if (!ress.authSetting["scope.writePhotosAlbum"]){
                getApp().hep.dig({
                  type: "sm",
                  title: "保存图片",
                  content: "通洗需要授权才能保存图片到你的相册",
                  confirmText: "去授权",
                  cancelText: "取消",
                  success(resm) {
                    if (resm.confirm) {
                      wx.openSetting({

                      })
                    }
                    else if (resm.cancel) {
                      if (failFn && typeof failFn == 'function') {
                        failFn();
                      }
                    }
                  },
                  fail(resm) {
                    
                  }
                })
              }
              else{
                if (failFn && typeof failFn=='function'){
                  failFn();
                }
              }
            }
          })
        }
      })
    },
    fail(res){

    }
  })
}

//小程序版本更新提示
function updateVersion(fn){
  return updateVersion.prototype.checkUpdate(fn);
  // updateManager.onCheckForUpdate((res)=>{
  //   console.log(res.hasUpdate)
  // }) 
}
updateVersion.prototype={
  "constructor": updateVersion,
  //获得版本更新对象
  getUpdateThis(){
    return wx.getUpdateManager();
  },
  // 检查小程序版本是否有新版本
  checkUpdate(fn){
    let _this=this;
    this.getUpdateThis().onCheckForUpdate((res)=>{
      if (res.hasUpdate){
        _this.updateCallback();
      }
    })
  },

  //版本更新回调
  updateCallback(){
    
    let updateManager = this.getUpdateThis();
    let _this=this;
    
    updateManager.onUpdateReady(()=>{
     
      getApp().hep.dig({
        type:"sm",
        title:"更新提示",
        content:"新版本已经准备好，是否重启应用？",
        success(res){
          if (res.confirm){
            updateManager.applyUpdate();
          }
          else if( res.cancel){
            return;
          }
        }
      })
    });
    
    //更新失败回调
    updateManager.onUpdateFailed(()=>{
      getApp().hep.dig({
        type:"sm",
        title:"更新提示",
        content:'新版本下载失败,请检查网络',
        showCancel: false
      })
    })
  },
}



module.exports={
  getWxLocation,
  wxPay,
  savaImage,
  updateVersion
}