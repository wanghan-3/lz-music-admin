/*
 * @Descripttion:
 * @Author: Wang Xi
 * @version:
 * @Date: 2024-07-07 22:02:21
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-16 00:21:55
 */
import request from "@/utils/request";
import { ResponseType } from "@/api/type.ts";
// import { replacePathParams } from "@/utils";

enum API {
  COURSES_LIST = "/course/list",
  DELETE_COURSES = "/course/delete",
  SAVE_COURSES = "/course/save", // 保存学生信息
}
// 获取权限列表
export const reqGetCoursesList = (data: any): Promise<ResponseType> =>
  request.post(API.COURSES_LIST, data);
export const reqDelCoursesById = (id: number | string): Promise<ResponseType> =>
  request.get(API.DELETE_COURSES + "/" + id);
export const reqSaveCourses = (data: any): Promise<ResponseType> =>
  request.post(API.SAVE_COURSES, data);
