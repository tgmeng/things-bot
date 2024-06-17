export function getWeekRange() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 获取今天是周几 (0 表示星期天，1 表示星期一，...)
  const dayDiff = (dayOfWeek + 6) % 7; // 计算今天和周一的差距天数

  // 获取周一的日期
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayDiff);
  monday.setHours(0, 0, 0, 0);

  // 获取周日的日期
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return [monday, sunday];
}

export function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  } 星期${["日", "一", "二", "三", "四", "五", "六"][date.getDay()]}`;
}
