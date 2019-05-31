const filter=require("../../../utils/helpers/filter.js");
const storage=require("../../../utils/helpers/storage.js");
Component({
  addGlobalClass: true,
  properties: {
   
  },

  data: {
    popup:false,
    serviceTimeLimits:[],//已预约满时间
    timeList:[],//取件时间段
    weekList:[],//取件日期
    weekActive:0,//当前选择日期
    timeActive:"",//当前选择时间段
    timestamp:"",//时间戳
    selectDay: {//选择的日期时间信息
      serviceTimeId: "",
      takeTimeStart: "",
      takeTimeEnd: "",
      takeDate: ""
    },
    btnFlag:false
  },
  attached(){
   
  },
  methods: {

    //弹框
    onShowPop(){
      if(this.data.weekList.length===0){
        this.getTakeServiceTime();
      }
     
      this.setData({
        popup:true
      })
    },

    // 得到时间段
    getTakeServiceTime() {
      getApp().http({
        url: "serviceTime/take/list",
        data: {}
      }).then(res => {
        this.data.timestamp = res.timestamp;
        this.getServiceTimeLimit(res.data);
      })
    },
      // 获取约满时间点
    getServiceTimeLimit(list){
      let now = filter.getDate(this.data.timestamp);
      getApp().http({
        url: "serviceTimeLimit/list",
        data: {
          date: now,
          size: storage.getMercInfo().takeTimeCount - 1
        }
      }).then(res => {
        this.data.serviceTimeLimits = res.data;
        this.initDayWeek();
        this.checkTime(list, now);
      })
    },

    //初始化日期
    initDayWeek() {
      for (let i = 0; i < storage.getMercInfo().takeTimeCount; i++) {
        let day = this.getDate(i);
        this.data.weekList.push(day);
      }
      let list = this.data.weekList;
      this.setData({
        weekList: list,
      })

      this.data.selectDay.takeDate = `${list[0].year}-${list[0].month}-${list[0].day}`
    },

    getDate(i) {
      let dayweek = filter.getDate(this.data.timestamp + 24 * 60 * 60 * 1000 * i).split("-");
      let week = this.formatWeek(i);
      return {
        year: dayweek[0],
        month: dayweek[1],
        day: dayweek[2],
        week: week
      }
    },

    //转换星期
    formatWeek(i) {
      let str;
      switch (i) {
        case 0:
          str = "今天"
          break;
        case 1:
          str = "明天"
          break;
        default:

          str = `星期${this.formatWeekNumber(new Date(this.data.timestamp + 24 * 60 * 60 * 1000 * i).getDay())}`;
          break;
      }
      return str
    },

    formatWeekNumber(week) {
      switch (week) {
        case 1:
          return "一";
          break;
        case 2:
          return "二";
          break;
        case 3:
          return "三";
          break;
        case 4:
          return "四";
          break;
        case 5:
          return "五";
          break;
        case 6:
          return "六";
          break;
        case 0:
          return "日";
          break;

      }
    },

    

    //校验取送时间段
    checkTime(list, day){
        let timeEnd=filter.getTime(this.data.timestamp).split(":")[0];
        for(let i=0;i<list.length;i++){
          list[i].limit = 0;
          let serviceTimeIdArr = [];
          for (let index in this.data.serviceTimeLimits){
            let obj = this.data.serviceTimeLimits[index];
            if (day == obj.date){
              serviceTimeIdArr = obj.serviceTimeIds ?  obj.serviceTimeIds.split(",") : [];
              break;
            }
          }
          for (let index in serviceTimeIdArr ){
            if (serviceTimeIdArr[index] == list[i].id){
              list[i].limit = 1
              break;
            }
          }
          list[i].disabled ? delete list[i].disabled : ""  
          if ((this.data.weekActive == 0 && parseInt(timeEnd) + 1 >=list[i].timeEnd.split(':')[0]) || list[i].status!=1 || list[i].limit){
              list[i].disabled=true;
          }
      }
      this.setData({
        timeList: list,

      })
    },

    //选择日期
    onSeleceday(e) {
      let index = getApp().hep.dataset(e, "index");
      let item = getApp().hep.dataset(e, "item");
      // this.setSelectday(item)
      // let day = `${item.year}-${item.month}-${item.day}`
      this.data.selectDay.takeDate = `${item.year}-${item.month}-${item.day}`
      this.setData({
        weekActive: index,
      })
      this.checkTime(this.data.timeList, this.data.selectDay.takeDate)
    },

    //选择时间段
    onSelectTime(e) {
      let item = getApp().hep.dataset(e, "item");
      if (item.disabled) {
        return;
      }
      let index = getApp().hep.dataset(e, "index");
      // this.setSelectday(item)
      
      this.data.selectDay.takeTimeStart = item.timeStart;
      this.data.selectDay.takeTimeEnd = item.timeEnd;
      this.setData({
        timeActive: index,
        "selectDay.serviceTimeId": item.id
      })
    },

    // //给selectday赋值
    // setSelectday(item){
    //   this.data.selectDay={
    //     serviceTimeId: item.serviceTimeId || "",
    //     takeTimeStart: item.takeTimeStart || "",
    //     takeTimeEnd: item.takeTimeEnd || "",
    //     takeDate: item.takeDate || ""
    //   }
    // },

    //点击按钮
    subSelectDay(){
      this.setData({
        popup:false,
        btnFlag:true,
        "selectDay.takeDate": this.data.selectDay.takeDate,
        "selectDay.serviceTimeId": this.data.selectDay.serviceTimeId,
        "selectDay.takeTimeStart": this.data.selectDay.takeTimeStart,
        "selectDay.takeTimeEnd": this.data.selectDay.takeTimeEnd
      })
      // storage.setStorage("")
      this.triggerEvent('callback',this.data.selectDay)
    },

    
  }
})
