/*
 * @Descripttion:
 * @Author: Wang Xi
 * @version:
 * @Date: 2024-07-29 00:49:39
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-29 00:52:39
 */
import request from "@/utils/request";
import { ResponseType } from "@/api/type.ts";
// import { replacePathParams } from "@/utils";

enum API {
  RECHARGE_LIST = "recharge/list",
  RECHARGE_SAVE = "recharge/save",
}
// 获取权限列表
export const reqGetRechargeList = (data: any): Promise<ResponseType> =>
  request.get(API.RECHARGE_LIST, { params: data });
// 充值记录保存-但是按理来说没有修改才对哈
export const reqSaveRechargeList = (data: any): Promise<ResponseType> =>
  request.post(API.RECHARGE_SAVE, data);
