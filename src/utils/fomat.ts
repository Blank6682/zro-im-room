// 时间 
function dealTime(unix_stamp: number): string { // unix_stamp 精确到微秒
  let _today_obj = new Date(),
    _today_date = {
      y: _today_obj.getFullYear(),
      m: (_today_obj.getMonth() + 1 < 10 ? '0' + (_today_obj.getMonth() - - 1) : (_today_obj.getMonth() - - 1)),
      d: (_today_obj.getDate() < 10 ? '0' + _today_obj.getDate() : _today_obj.getDate())
    }

  let _today_stamp = Date.parse(_today_date.y + '/' + _today_date.m + '/' + _today_date.d + ' 00:00:00')

  let stamp = []
  stamp[0] = _today_stamp + 86400000
  stamp[1] = _today_stamp
  stamp[2] = _today_stamp - 86400000
  stamp[3] = _today_stamp - 172800000

  stamp[4] = _today_stamp - 518400000 // 7天

  stamp[5] = _today_stamp - 31536000000 // 365天

  let _compare_obj = new Date()
  _compare_obj.setTime(unix_stamp)

  let return_str = ''

  let hour = _compare_obj.getHours()
  let hour_str = ''
  if (0 < hour && hour <= 6) {
    hour_str = '凌晨' + ' ' + hour
  } else if (6 < hour && hour <= 12) {
    hour_str = '上午' + ' ' + hour
  } else if (12 < hour && hour <= 18) {
    hour_str = '下午' + ' ' + (hour - 12)
  } else if (18 < hour && hour <= 24) {
    hour_str = '晚上' + ' ' + (hour - 12)
  }

  if (unix_stamp >= stamp[1] && unix_stamp < stamp[0]) {
    return_str = hour_str + ':' + (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())
  } else if (unix_stamp >= stamp[2] && unix_stamp < stamp[1]) {
    let yesterdayText = '昨天'
    return_str = yesterdayText + ' ' + hour_str + ':' +
      (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())
  } else if (unix_stamp >= stamp[3] && unix_stamp < stamp[2]) {
    let theDayBeforeYesterdayText = '前天'
    return_str = theDayBeforeYesterdayText + ' ' + hour_str + ':' +
      (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())

  } else if (unix_stamp >= stamp[4] && unix_stamp < stamp[3]) { // 7天内
    let daynames = ['日', '一', '二', '三', '四', '五', '六']
    let dathStr = '周' + daynames[_compare_obj.getDay()]

    let SundayText = '周日'
    let MondayText = '周一'
    let TuesdayText = '周二'
    let WednesdayText = '周三'
    let ThursdayText = '周四'
    let FridayText = '周五'
    let SaturdayText = '周六'

    let dathStr2

    switch (dathStr) {
      case '周日':
        dathStr2 = SundayText
        break
      case '周一':
        dathStr2 = MondayText
        break
      case '周二':
        dathStr2 = TuesdayText
        break
      case '周三':
        dathStr2 = WednesdayText
        break
      case '周四':
        dathStr2 = ThursdayText
        break
      case '周五':
        dathStr2 = FridayText
        break
      case '周六':
        dathStr2 = SaturdayText
        break
      default:
        dathStr2 = dathStr
        break
    }

    return_str = dathStr2 + ' ' + _compare_obj.getHours() + ':' +
      (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())
  } else if (unix_stamp >= stamp[5] && unix_stamp < stamp[4]) { // 365天内
    let monthText = '月'
    let dayText = '日'
    return_str = (_compare_obj.getMonth() - (-1)) + monthText + _compare_obj.getDate() + dayText + ' '
      + _compare_obj.getHours() + ':' + (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())

  } else {
    let yearText = '年'
    let monthText = '月'
    let dayText = '日'
    return_str = _compare_obj.getFullYear() + yearText + (_compare_obj.getMonth() - (-1)) +
      monthText + _compare_obj.getDate() + dayText + ' ' + _compare_obj.getHours() + ':' +
      (_compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes())
  }

  return return_str
}

export { dealTime }
