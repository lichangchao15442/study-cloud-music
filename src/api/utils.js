// 防抖函数
const debounce = (func, delay) => {
  // func是防抖处理的函数，delay是时间间隔
  // 通过闭包缓存一个定时器id
  let timer = null;
  // 将debounce处理结果当作函数返回，触发事件回调时执行这个函数
  return function(...args) {
    // 如果已经设置定时器，就清楚上次设置的定时器
    if (timer) {
      clearTimeout(timer);
    }
    // 开始设置一个新的定时器，定时器结束后执行传入的函数func
    timer = setTimeout(() => {
      func.apply(this, args);
      clearTimeout(timer);
    }, delay);
  };
};

export { debounce };

// 处理歌手列表拼接歌手名字
export const getName = list => {
  let str = "";
  list.map((item, index) => {
    str += index === 0 ? item.name : "/" + item.name;
    return item;
  });
  return str;
};

// 处理数据，找出第一个没有歌名的排行榜的索引
export const filterIndex = rankList => {
  for (let i = 0; i < rankList.length - 1; i++) {
    if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
      return i + 1;
    }
  }
};

// 判断一个对象是否为空对象
export const isEmptyObject = obj => !obj || Object.keys(obj).length === 0;
