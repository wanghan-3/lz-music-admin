/*
 * @Descripttion: js常量文件
 * @Author: Wang Xi
 * @version: 1.0
 * @Date: 2024-04-14 21:00:56
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-07 22:14:38
 */
// 学生的年级
export const gradeList = [
  {
    id: 1,
    name: "幼儿园",
    children: [
      {
        id: 1,
        name: "小班",
      },
      {
        id: 2,
        name: "中班",
      },
      {
        id: 3,
        name: "大班",
      },
    ],
  },
  {
    id: 2,
    name: "小学",
    children: [
      {
        id: 1,
        name: "一年级",
      },
      {
        id: 2,
        name: "二年级",
      },
      {
        id: 3,
        name: "三年级",
      },
      {
        id: 4,
        name: "四年级",
      },
      {
        id: 5,
        name: "五年级",
      },
      {
        id: 6,
        name: "六年级",
      },
    ],
  },
  {
    id: 3,
    name: "中学",
    children: [
      {
        id: 1,
        name: "初一",
      },
      {
        id: 2,
        name: "初二",
      },
      {
        id: 3,
        name: "初三",
      },
      {
        id: 4,
        name: "高一",
      },
      {
        id: 5,
        name: "高二",
      },
      {
        id: 6,
        name: "高三",
      },
    ],
  },
  {
    id: 4,
    name: "大学",
    children: [
      {
        id: 1,
        name: "大一",
      },
      {
        id: 2,
        name: "大二",
      },
      {
        id: 3,
        name: "大三",
      },
      {
        id: 4,
        name: "大四",
      },
      {
        id: 5,
        name: "研究生",
      },
      {
        id: 6,
        name: "博士生",
      },
    ],
  },
  {
    id: 5,
    name: "成人",
  },
];
export const relationshipList = [
  { id: 1, value: "父亲" },
  { id: 2, value: "母亲" },
  { id: 11, value: "爷爷" },
  { id: 12, value: "奶奶" },
  { id: 21, value: "外公" },
  { id: 22, value: "外婆" },
  { id: -1, value: "其他" },
];
export const sexList = [
  { id: 1, value: "男" },
  { id: 2, value: "女" },
  { id: 0, value: "未知" },
];
