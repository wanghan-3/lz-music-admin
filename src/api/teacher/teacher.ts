/*
 * @Descripttion:
 * @Author: Wang Xi
 * @version:
 * @Date: 2024-07-07 22:02:21
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-14 23:04:32
 */
import request from "@/utils/request";
import { ResponseType } from "@/api/type.ts";
// import { replacePathParams } from "@/utils";

enum API {
  TEACHER_LIST = "/teacher/list",
  DELETE_TEACHER = "/teacher/delete",
  SAVE_TEACHER = "/teacher/save", // 保存教师信息
}
// 获取权限列表
export const reqGetTeacherList = (data: any): Promise<ResponseType> =>
  request.get(API.TEACHER_LIST, { params: data });
export const reqDelTeacherById = (id: number | string): Promise<ResponseType> =>
  request.get(API.DELETE_TEACHER + "/" + id);
export const reqSaveTeacher = (data: any): Promise<ResponseType> =>
  request.post(API.SAVE_TEACHER, data);
