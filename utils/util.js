const formatTime = date => {
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  date = date ? new Date(date) : new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  var weekday
  switch (date.getDay())
  {
    case 0:
      weekday = '周日';
      break;
    case 1:
      weekday = '周一';
      break;
    case 2:
      weekday = '周二';
      break;
    case 3:
      weekday = '周三';
      break;
    case 4:
      weekday = '周四';
      break;
    case 5:
      weekday = '周五';
      break;
    case 6:
      weekday = '周六';
      break;
  }

  return {
    datetime: [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':'),
    date: [year, month, day].map(formatNumber).join('-'),
    time: [hour, minute, second].map(formatNumber).join(':'),
    time1: [hour, minute].map(formatNumber).join(':'),//获取当前时间不含秒
    weekday: weekday
  }
}

const addTime = (time,min) => {
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  var times = time.split(':');
  var hs = parseInt(times[0]);
  var ms = parseInt(times[1]);

  console.log(ms + min);
  var carry_hour = Math.floor((ms + min)/60);
  console.log("c_hour:"+carry_hour);
  var carry_minu = (ms + min) % 60;
  console.log("c_min:" + carry_minu);
  hs = carry_hour+hs;
  console.log("hs:" + hs);
  ms = carry_minu;
  console.log(hs);
  console.log(ms);
  return {
    time: [hs, ms].map(formatNumber).join(':'),
  }
 }
// 提示错误信息
const isError = (msg, that) => {
  that.setData({
    errorMsg: msg,
    showTopTips: true
  });
  setTimeout(function () {
    that.setData({
      errorMsg: '',
      showTopTips: false
    })
  }, 2000);
}

module.exports = {
  formatTime,
  addTime,
  isError
}
