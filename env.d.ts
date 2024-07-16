/*
 * @Descripttion:
 * @Author: Wang Xi
 * @version:
 * @Date: 2024-06-05 23:41:15
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-06-05 23:41:28
 */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
