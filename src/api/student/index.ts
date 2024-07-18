/*
 * @Descripttion:
 * @Author: Wang Xi
 * @version:
 * @Date: 2024-07-07 22:02:21
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-18 23:10:21
 */
import request from "@/utils/request";
import { ResponseType } from "../../type";
// import { replacePathParams } from "@/utils";

enum API {
  STUDENT_LIST = "student/list",
  DELETE_STUDENT = "student/delete",
  SAVE_STUDENT = "student/saveOrUpdate", // 保存学生信息
  SAVE_STUEDENT_COURSES = "student/saveStuedentCourses", // 保存学生信息
  GET_STUEDENT_COURSES = "student/coursesListByStudentId", // 保存学生信息
}
// 获取权限列表
export const reqGetStudentList = (data: any): Promise<ResponseType> =>
  request.get(API.STUDENT_LIST, { params: data });
export const reqDelStudentById = (id: number | string): Promise<ResponseType> =>
  request.get(API.DELETE_STUDENT + "/" + id);
export const reqSaveStudent = (data: any): Promise<ResponseType> =>
  request.post(API.SAVE_STUDENT, data);
// 保存学生选课信息
export const reqSaveStudentCourses = (data: any): Promise<ResponseType> =>
  request.post(API.SAVE_STUEDENT_COURSES, data);

export const reqGetStudentCourses = (id: any): Promise<ResponseType> =>
  request.get(API.GET_STUEDENT_COURSES + "/" + id);
