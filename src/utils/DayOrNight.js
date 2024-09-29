/**
 * 判断当前时间是白天还是晚上
 * @returns {boolean} true:晚上  false:白天
 */
function DayOrNight() {
  let date = new Date();
  let hours = date.getHours();

  //  true:晚上  false:白天
  if (hours >= 6 && hours < 18) {
    return false;
  } else {
    return true;
  }
}

export default DayOrNight;
