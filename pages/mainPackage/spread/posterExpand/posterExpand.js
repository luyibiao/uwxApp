// pages/mainPackage/spread/posterExpand/posterExpand.js 
const imgurl = getApp().hep.imgurl
const storage = require("../../../../utils/helpers/storage.js")
const wxbarcode = require("../../../../utils/view/wxbarcode.js")
const methods=require("../../../../utils/helpers/methodser.js");
const watch=require("../../../../utils/view/watch.js");
const wc=require("../../../../utils/config/wxConfig.js")
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    poster: {}, 
    headImg: imgurl + 'delimg/def.png',
    shareImg: imgurl + "icon/share.png",
    closeImg: imgurl +"icon/close.png",
    popFlag:false,
    modal:false,
    merc:{},
    spreadCode:"",
    screenHeight: methods.getWidthOrheight().height,
    screenWidth: methods.getWidthOrheight().width,
    logurl:`${imgurl}delimg/autograph.png`,
    storageImage:{
      codeImage: "",
      bdImage:"",
      headImage:"",
      logoImage:""
    }
    
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    getApp().hep.callback(() => {
      this.data.merc = storage.getMercInfo();
      if (!options.spreadCode || !this.data.merc) {
        getApp().hep.dig({ type: 'st', title: "页面数据错误", icon: "error" });
        return;
      }
      this.data.spreadCode = options.spreadCode
      this.getPoster(options.spreadCode, this.data.merc.code);
   
     
    }, this.route)
  },


  /** 
   * 用户点击右上角分享 
   */
  onShareAppMessage: function (res) {
    this.setData({
      popFlag:false
    })
    return getApp().hep.shareContent(this.data.poster.title, `/pages/mainPackage/tabbar/index/index`, this.data.poster.imgPath)

  },
  getPoster(spreadCode, uCode) {
    getApp().hep.dig();
    
    getApp().http({
      url: "friendInfo/open/invite",
      data: {
        spread_code: spreadCode,
        u_code: uCode
      }
    }).then(res => {
      let _this=this
      if (res.data.codeUrl){
        wxbarcode.qrcode('qrcode', res.data.codeUrl, 211, 211);
      }
      this.setData({
        poster: res.data
      })
      wx.hideLoading();
    });
  },
  previewImage: function (e) {

  },
  //弹出框回调
  onPopup(e) {
    this.data.popFlag = e.detail.popup
    this.setData({
      popFlag: false
    })
  },
  openPopup(){
    let _this=this;
    wx.canvasToTempFilePath({
      canvasId: "qrcode",
      width: 110,
      heght: 110,
      success(res) {
        _this.setData({
          'storageImage.codeImage': res.tempFilePath
        })
       

      },
      fail(res) {
        console.log(res, '回调失败')
      }
    })
    this.setData({
      popFlag: true,
      
    })
  },
  closePopup(){
    this.setData({
      popFlag: false
    })
  },

  //生成海报
  onCreatePoster(){
    var that = this;
    getApp().hep.dig();
    // this.createCavers();
    // return;
    //生成背景
    wx.getImageInfo({
      src: methods.replaceHttps(that.data.poster.imgPath) ,
      success(resa) {
        that.setData({
          "storageImage.bdImage": resa.path
        })
      
        //生成头像
        wx.getImageInfo({
          src: that.data.poster.headImgPath,
          success(resh){
            that.setData({
              "storageImage.headImage": resh.path
            })

          //生成logo
          wx.getImageInfo({
            src: `${imgurl}delimg/autograph.png`,
            success(resl){
              that.setData({
                "storageImage.logoImage": resl.path
              })
              that.createCavers();
            }
          })
          }
        })
        
      },
      fail(res){
        console.log(res)
      }
    })
  },

  //关闭海报
  onClosePoster(){
    this.setData({
      modal: false
    })
  },

  createCavers(){
    var that = this;
    let width = that.data.screenWidth;
    let height = that.data.screenHeight
    let halfHeight = (height ) * 0.85 / 2;
    let halfWidth = (width *0.9*0.85);
    

    //2. canvas绘制文字和图片
    const ctx = wx.createCanvasContext('share');
    ctx.setFillStyle('white')
    ctx.fillRect(0, halfHeight, 1000, 1000)
    
    var bgImgPath = that.data.poster.imgPath;
    
    //绘制背景
    ctx.drawImage(that.data.storageImage.bdImage, 0, 0, halfWidth, halfHeight);

    //绘制头像
    ctx.drawImage(that.data.storageImage.headImage, 10, halfHeight + 10, 60, 60);
    ctx.setFontSize(12);
    ctx.setFillStyle("black");
    methods.drawText(ctx, that.data.poster.title, 10, halfHeight + 85, 0, 100)
  
    // ctx.fillText(that.data.poster.title, 10, halfHeight + 85);
    

    //绘制二维码
    ctx.drawImage(that.data.storageImage.codeImage, halfWidth - 90, halfHeight + 10, 90, 90)
    ctx.fillText('长按识别二维码', halfWidth - 94, halfHeight + 110, 100);

    //绘制logo
    ctx.drawImage(that.data.storageImage.logoImage, halfWidth / 2 - 25, halfHeight * 2 - 90, 50, 20)

    ctx.setFillStyle("#98a6ad")
    ctx.fillText('通洗提供技术支持', halfWidth / 2 - 55, halfHeight * 2 - 52, 110);

    

    ctx.stroke();
    ctx.draw();
    this.setData({
      modal: true,
      popFlag: false
    })

    wx.hideLoading()
    
  },

  
  //保存至相册
  saveImageToPhotosAlbum: function () {
    let _this=this;
    wc.savaImage("share",()=>{
      _this.setData({
        modal: false,
      })
    })
  },

  


})
