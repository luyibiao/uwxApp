const storage = require("../../../../utils/helpers/storage.js")
const methodser = require("../../../../utils/helpers/methodser.js")
const imgurl = getApp().hep.imgurl

Page({
  data: {
    tel:'',
    telImg: imgurl + "icon/tel.png"
  },
  onShow() {
    getApp().hep.callback(() => {
      this.getTel();
    });
  },
  getTel() {
    let cityInfo = storage.getCityInfo();
    let tel = '';
    if (cityInfo && cityInfo.tel) {
      tel = cityInfo.tel;
    } else {
      let mercInfo = storage.getMercInfo();
      if (mercInfo && mercInfo.tel) {
        tel = mercInfo.tel;
      }
    }
    this.setData({
      tel
    });
  },
  onCallPhone() {
    methodser.callPhone(this.data.tel)
  },
});