/**
 * 封装watch监听事件
 */

function setWatch(_this, watch){
  Object.keys(watch).forEach(v => {
    let key = v.split('.');
    let setdata = _this.data;
    for (let i = 0; i < key.length - 1; i++) {
      setdata = setdata[key[i]];
    }
    let lastKey = key[key.length - 1];
    let setVal = setdata[lastKey];
    Object.defineProperty(setdata, lastKey, {
      configurable: true,
      enumerable: true,
      get: function () {
        return setVal
      },
      set: function (val) {
        _this.watch[v].call(_this, val, setVal);
        setVal = val;
      }
    })
  })
}

module.exports={
  setWatch
}