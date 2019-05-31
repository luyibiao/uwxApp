module.exports={
  data:{
    tsway:{},
  },
  getTsWayList (fn){
    getTsWay.call(this,fn)
  },
  formatArr(data,fn){
    formatArr.call(this,data,fn)
  },
  methods:{
    getTsWayList(fn) {
      getTsWay.call(this, fn)
    },
    formatArr(data, fn) {
      formatArr.call(this, data, fn)
    },
  }
}

function getTsWay(fn){
  getApp().http({
    url: 'mercCarriage/list',
    data: {}
  }).then(res => {
    let Arr = res.data;
    this.formatArr(Arr, fn)
  })
}

function formatArr(data, fn){
  let obj = {};
  for (let i = 0; i < data.length; i++) {
    if (!obj[data[i].type]) {
      obj[data[i].type] = [data[i]]
    }
    for (let j = i + 1; j < data.length; j++) {
      if (data[i].type === data[j].type) {
        obj[data[i].type] = [data[i], data[j]]
      }
    }
  }
  this.data.tsway = { ...obj }
  let i=0,typeList=[];
  Object.keys(obj).forEach((item)=>{
    typeList.push(item);
    i++;
  })
  let query={
    tsnum:i,
    typeList
  }
  if (fn && typeof fn == "function") {
    fn(query);
  }
}