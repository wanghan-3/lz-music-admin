/*
 * @Descripttion:
 * @Author: Wang Xi
 * @version:
 * @Date: 2024-06-05 22:32:25
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-07 16:30:02
 */
import request from "@/utils/request";
import { LoginData, LoginRes, UserInfo } from "./type";
import { ResponseType } from "../type";
enum API {
  LOGIN = "user/login",
  USER_INFO = "admin/acl/index/info",
  LOGOUT = "user/logout",
}
// 登录
export const reqLogin = (_: LoginData) =>
  request.post<any, ResponseType<LoginRes>>(API.LOGIN, _);
// 登出
export const reqLogout = () => request.get<any, ResponseType>(API.LOGOUT);
// 用户信息
export const reqUserInfo = () =>
  request.get<any, ResponseType<UserInfo>>(API.USER_INFO);
