import moment from "moment";
import { gradeList } from "./constants";

export function getTimeOfDay(date = new Date()) {
  const currentHour = new Date(date).getHours();

  if (currentHour >= 0 && currentHour < 6) {
    return "凌晨";
  } else if (currentHour >= 6 && currentHour < 12) {
    return "上午";
  } else if (currentHour >= 12 && currentHour < 14) {
    return "中午";
  } else if (currentHour >= 14 && currentHour < 18) {
    return "下午";
  } else if (currentHour >= 18 && currentHour < 24) {
    return "晚上";
  } else {
    return "";
  }
}
/*
  为啥这么弄主要是方便数据加密处理吧，因为目前接触到的公司业务请求加密
  Query类型 和 body类型都可以在拦截器中捕获替换,但是 RESTful风格的URL参数
  这种跟随在路径中的就不明确什么是数据什么是路径了 别的暂时没考虑到。。。
  而且这种嘛在写的时候和普通get一样的写。
 */
/**
 * 替换路径参数
 * @param path 路径字符串
 * @param data 包含替换值的对象
 * @returns 返回替换后的路径字符串
 */
export function replacePathParams(path: string, data: { [key: string]: any }) {
  let newPath = path;
  for (const key in data) {
    if (data[key]) {
      newPath = newPath.replace(`{${key}}`, data[key]);
    }
  }
  return newPath;
}
/**
 * 构建URL
 *
 * @param url URL地址
 * @param params 参数对象
 * @returns 带有参数的URL地址
 */
export function buildUrl(url: string, params: { [key: string]: any }) {
  let queryString = "";
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      if (queryString.length > 0) {
        queryString += "&";
      }
      queryString +=
        encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    }
  }
  return url + "?" + queryString;
}
export function getRandomNumber(min = 1000, max = 5000) {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}
export function deepClone(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  let clone: any;

  if (Array.isArray(obj)) {
    clone = [];
    for (let i = 0; i < obj.length; i++) {
      clone.push(deepClone(obj[i]));
    }
  } else {
    clone = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = deepClone(obj[key]);
      }
    }
  }

  return clone;
}
export function debounce(func: any, wait: any, immediate: any) {
  let timeout: any, args: any, context: any, timestamp: any, result: any;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args: any) {
    context = this as any;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}
// 根据某个属性值从MenuList查找拥有该属性值的menuItem
export function getMenuItemInMenuListByProperty(
  menuList: any,
  key: string,
  value: string,
) {
  let stack: any[] = [];
  stack = stack.concat(menuList);
  let res;
  while (stack.length) {
    const cur = stack.shift();
    if (cur.children && cur.children.length > 0) {
      stack = cur.children.concat(stack);
    }
    if (value === cur[key]) {
      res = cur;
    }
  }
  return res;
}

/**
 * @description 将时间戳转换为年-月-日-时-分-秒格式
 * @param {String} timestamp
 * @returns {String} 年-月-日-时-分-秒
 */

export function timestampToTime(timestamp: string) {
  const date = new Date(timestamp);
  const Y = date.getFullYear() + "-";
  const M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  const D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  const h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  const m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  const s =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  const strDate = Y + M + D + h + m + s;
  return strDate;
}
/**
 * @description 将时间戳转换为  格式
 * @param {String} date 日期时间
 * @returns {String} bmp 格式
 */
export function dateFormat(date: string, bmp = "YYYY-MM-DD HH:mm:ss") {
  return moment(date).format(bmp);
}

export function findGradeById(gradeId: string, grades = gradeList, name = "") {
  gradeId = gradeId.toString();
  for (const grade of grades) {
    if (grade.id.toString() == gradeId.charAt(0)) {
      name += (name ? " - " : "") + grade.name;
      if (gradeId.length > 1 && grade.children && grade.children.length > 0) {
        name = findGradeById(gradeId.slice(1), grade.children, name); // 使用递归调用的返回值更新name
      }
    }
  }
  return name;
}
