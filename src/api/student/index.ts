/*
 * @Descripttion:
 * @Author: Wang Xi
 * @version:
 * @Date: 2024-07-07 22:02:21
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-12 01:38:49
 */
import request from "@/utils/request";
import { ResponseType } from "../../type";
// import { replacePathParams } from "@/utils";

enum API {
  STUDENT_LIST = "student/list",
  DELETE_STUDENT = "student/delete",
  SAVE_STUDENT = "student/saveOrUpdate", // 保存学生信息
}
// 获取权限列表
export const reqGetStudentList = (data: any): Promise<ResponseType> =>
  request.get(API.STUDENT_LIST, { params: data });
export const reqDelStudentById = (id: number | string): Promise<ResponseType> =>
  request.get(API.DELETE_STUDENT + "/" + id);
export const reqSaveStudent = (data: any): Promise<ResponseType> =>
  request.post(API.SAVE_STUDENT, data);
// export const reqSavePremission = (data: any) =>
//   request.post(API.SAVE_PERMISSION_URL, data);
// export const reqUpdatePrmission = (data: any) =>
//   request.put(API.UPDATE_PERMISSION_URL, data);
// export const reqSaveOrUpdatePremission = (data: any) =>
//   data.id ? reqUpdatePrmission(data) : reqSavePremission(data);
// export const reqDeletePremission = (id: number) =>
//   request.delete(replacePathParams(API.DELETE_PREMISSION_URL, { id }));
