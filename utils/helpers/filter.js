var time = require("./time.js")
var keyval=require("../variable/dickeyval.js");

var DATE_FORMATTER = 'yyyy-MM-dd';
var DATE_FORMATTER_CONCISE = 'MM/DD/YYYY'
var TIME_FORMATTER = 'hh:mm:ss'
var TIME_MINUTE = 'hh:mm'
var TIME_FORMAMM = 'YYYY-MM'

module.exports={
  // 手机号
  tel: function (val, ignoreEmpty) {
    let regex = /^1[0-9]{10}$/ || /^\d{3,4}-?\d{7,8}$/ || /^\d{3,4}-?\d{3,4}-(\d{3,4})$/ || /^\d{3,4}-?\d{7,8}-(\d{1,4})$/;
    return this.pattern(regex, val, ignoreEmpty);
  },

  pattern: function (regex, val, ignoreEmpty) {
    let ce = typeof (ignoreEmpty) === 'boolean' ? ignoreEmpty : false;
    if (!this.notEmpty(val)) {
      return ce;
    }
    return regex.test(val);
  },

  // 非空判断
  notEmpty: function (val) {
    return typeof (val) !== "undefined" && val !== null && String(val).length > 0;
  },

  formatTtime(val,type){

    return time.formatTime(val, type || DATE_FORMATTER)
  },

  /**
  * 年-月-日
  * @param {string} time 时间
  * @return {string}
  */
  getDate(val){
    return time.formatTime(val, DATE_FORMATTER)
  },

  /**
   * 时:分:秒
   * @param {string} time 时间
   * @return {string}
   */
  getTime(val) {
    return time.formatTime(val, TIME_FORMATTER)
  },
  
  /**
   * 时：分
   * @param {string} time 时间
   * @return {string}
   */
  getMinute(val){
    return time.formatTime(val, TIME_MINUTE)
  },

  /**
   * 年-月-日 时:分:秒
   * @param {string} time 时间
   * @return {string}
   */
  getDateTime(val) {
    return time.formatTime(val)
  },

  /**
   * 日期转时间戳,val 要转换的日期
   */
  getTimestamp(val){
    return new Date(val).getTime();
  },

  getValText(val,key){
    var list = keyval[key];
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (item.val == val) {
        return item.text;
      }
    }
    return val;
  },
  amtFormat(val){
  var value = '';
  if (val || val === 0) {
    value = val / 100;
    return Number(value).toFixed(2);
  }
}
}