const imgurl = getApp().hep.imgurl
const storage = require("../../../../utils/helpers/storage.js")
const wxbarcode = require("../../../../utils/view/wxbarcode.js")
const methods = require("../../../../utils/helpers/methodser.js");
const wc = require("../../../../utils/config/wxConfig.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popFlag:false,
    modal:false,
    corImage:false,
    shareImg: imgurl + "icon/share.png",
    closeImg: imgurl + "icon/close.png",
    inviteIcon: imgurl +"icon/invite_card-icon.png",
    screenHeight: methods.getWidthOrheight().height,
    screenWidth: methods.getWidthOrheight().width,
    poster: {},
    spreadCode:"",
    storageImage:{
      codeImage:"",
      inviteImage:"",
      headImage:"",
      logoImage: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().hep.callback(() => { 
      this.getPoster(options.spreadCode );
      this.data.spreadCode = options.spreadCode
    }, this.route);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (res) {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    this.setData({
      popFlag: false
    })
    return getApp().hep.shareContent(this.data.poster.name, `/pages/mainPackage/spread/index/index`)
  },
  getPoster(spreadCode) {
    let merc = storage.getMercInfo()
    getApp().hep.dig()
    getApp().http({
      url:"friendInfo/open/invite",
      data:{
        spread_code: spreadCode,
        u_code:merc.code
      }
    }).then(res=>{
      wxbarcode.qrcode('qrcode', res.data.codeUrl, 210, 210);
      this.setData({
        poster:res.data
      })
      wx.hideLoading()
    })
  },
  openPopup() {
    let _this=this;
    wx.canvasToTempFilePath({
      canvasId: 'qrcode',
      success(res){
        
        _this.setData({
          'storageImage.codeImage': res.tempFilePath
        })
      }
    }, this)
    this.setData({
      popFlag: true
    })
  },
  closePopup() {
    this.setData({
      popFlag: false
    })
  },

  onCreatePoster(){
    let that=this;
    getApp().hep.dig();
    //获得邀请卡图片临时文件
    wx.getImageInfo({
      src: that.data.inviteIcon,
      success(resi) {
        that.setData({
          "storageImage.inviteImage": resi.path
        })
       
        //生成头像
        wx.getImageInfo({
          src: that.data.poster.headImgPath,
          success(resh) {
            that.setData({
              "storageImage.headImage": resh.path
            })
           

            //生成logo
            wx.getImageInfo({
              src: `${imgurl}delimg/autograph.png`,
              success(resl) {
                that.setData({
                  "storageImage.logoImage": resl.path
                })
                
                that.createCavers();
              }
            })
          }
        })

      },
      fail(resi) {
        console.log(resi)
      }
    })
   
  },

  //创建createCavers
  createCavers(){
    const ctx = wx.createCanvasContext('share');
    let width = this.data.screenWidth;
    let height = this.data.screenHeight
    let halfWidth = (width * 0.9); //canvas宽度
    let halfHeight = (height - 50); //canvas高度

    //绘制矩形背景颜色
    ctx.setFillStyle('#fff');
    ctx.fillRect(0, 0, halfWidth, halfHeight);

    //绘制内矩形边框及内部渐变颜色
    const grd = ctx.createLinearGradient(0, 10, 0, halfHeight * 0.7 - 20);
    grd.addColorStop(0, '#fff6ed')
    grd.addColorStop(1, '#fff6ed')
    ctx.setFillStyle(grd)
    ctx.setStrokeStyle('#fbdabf');
    ctx.rect(15, 20, (halfWidth / 2 - 15) * 2, halfHeight * 0.7);
    ctx.stroke();
    ctx.fill();

    //绘制顶部邀请卡
    ctx.drawImage(this.data.storageImage.inviteImage, halfWidth / 2 - 100, 50, 200, 20);

    //画圆
    ctx.save()
    ctx.beginPath()
    ctx.arc(halfWidth / 2, 130, 30, 0, 2 * Math.PI)
    ctx.stroke();
    ctx.clip()
    ctx.drawImage(this.data.storageImage.headImage, halfWidth / 2 - 30, 100, 60, 60);
    ctx.restore();

    //绘制姓名
    ctx.setFillStyle("#98a6ad")
    ctx.setTextAlign("center")
    ctx.setFontSize(12);
    ctx.fillText(this.data.poster.name, halfWidth / 2, 180)

    //绘制文字
    ctx.setFontSize(16);
    ctx.setFillStyle("black")
    ctx.fillText("邀请你一起加入，推广赢奖励", halfWidth / 2, 210);

    //绘制二维码
    ctx.drawImage(this.data.storageImage.codeImage, halfWidth / 2 - 45, halfHeight * 0.7 - 100, 90, 90);
    ctx.setFontSize(12);
    ctx.setFillStyle("#98a6ad")
    ctx.fillText('长按识别二维码', halfWidth / 2 - 2, halfHeight * 0.7);

    //绘制logo
    ctx.drawImage(this.data.storageImage.logoImage, halfWidth / 2 - 25, halfHeight * 0.7 + 35, 50, 20);
    ctx.fillText("通洗提供技术支持", halfWidth / 2, halfHeight * 0.7 + 70)


    ctx.draw()
    this.setData({
      modal: true,
      popFlag: false
    })
    setTimeout(()=>{
      this.setData({
        corImage:true
      })
    },200)
    wx.hideLoading()
  },

  //关闭海报
  onClosePoster() {
    this.setData({
      modal: false
    })
  },

  //保存图片
  saveImageToPhotosAlbum(){
    let _this=this;
    wc.savaImage("share", () => {
      _this.setData({
        modal: false,
      })
    })
  }
})