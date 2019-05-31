const REGEX = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
export const formatTime = (val, format) => {
  if (val) {
    /**
     * @instructions 如果不是时间戳格式，且含有字符 '-' 则将 '-' 替换成 '/' && 删除小数点及后面的数字
     * @reason 将 '-' 替换成 '/' && 删除小数点及后面的数字 的原因是safari浏览器仅支持 '/' 隔开的时间格式
     */
    if (val.toString().indexOf('-') > 0) {
      val = val.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/'); // 将 '-' 替换成 '/'
      val = val.slice(0, val.indexOf(".")); // 删除小数点及后面的数字
    }
    let date = new Date(val);
    date.setHours(date.getHours() + 8);
    const [whole, yy, MM, dd, hh, mm, ss] = date.toISOString().match(REGEX);
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const dates = new Date().getDate();
    if (format) {
      return format
        .replace('yyyy', yy)
        .replace('yy', yy.slice(2))
        .replace('MM', MM)
        .replace('dd', dd)
        .replace('hh', hh)
        .replace('mm', mm)
        .replace('ss', ss)
    } else {
      return [yy, MM, dd].join('-') + ' ' + [hh, mm, ss].join(':');
    }
  } else {
    return '--';
  }
} 

export const add = (dtstr, n, type) => {
  if(dtstr.toString().indexOf("-")<=0){
    return "";
  }
  let time = ""
  if (type == "month"){
    time = addmulMonth(dtstr, n)
  }else{
    time = addmulDay(dtstr, n)
  }
  return time;
}

function addmulMonth(dtstr, n) {   // n个月后 

  var s = dtstr.split("-");
  var yy = parseInt(s[0]); var mm = parseInt(s[1] - 1); var dy = parseInt(s[2] || '1')
  var dt = new Date(yy, mm, dy);
  dt.setMonth(dt.getMonth() + n);
  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var days = dt.getDate();
  var dd = year + "-" + (month.toString().length == 1 ? '0' + month : month) + "-" + (days.toString.length == 1 ? "0" + days : days);
  return dd;
}

function addmulDay(dtstr, n) {
  var s = dtstr.split("-");
  var yy = parseInt(s[0]); var mm = parseInt(s[1] - 1); var dd = parseInt(s[2]);
  var dt = new Date(yy, mm, dd);
  let time = dt.getTime() + parseInt(n) * 24 * 60 * 60 * 1000;
  return formatTime(time, "yyyy-MM-dd");
}