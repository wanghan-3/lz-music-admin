<!--
 * @Descripttion: 
 * @Author: Wang Xi
 * @version: 
 * @Date: 2024-06-05 23:43:04
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-29 01:49:44
-->
<template>
  <div class="student_allocation">
    <Viewer>
      <template #header>
        <div class="form_box">
          <TitleLine title="学生信息"></TitleLine>
          <div class="student-info">
            <el-form
              :disabled="true"
              ref="formRef"
              :model="route.query"
              label-width="auto"
              inline
            >
              <el-form-item label="学生姓名：" prop="name">
                <el-input
                  v-model="route.query.name"
                  placeholder="请输入学生姓名"
                />
              </el-form-item>
              <el-form-item label="学生年龄：" prop="age">
                <el-input-number
                  :model-value="~~route.query.age"
                  placeholder="请输入学生年龄"
                  controls-position="right"
                />
              </el-form-item>
              <el-form-item label="学生年级：" prop="grade">
                <el-cascader
                  placeholder="选择学生年级"
                  :props="{ value: 'id', label: 'name' }"
                  :options="gradeList"
                  :model-value="
                    String(route.query.grade)
                      .split('')
                      .map((m) => Number(m))
                  "
                  @change="handleClick($event, 'searchForm')"
                />
              </el-form-item>
            </el-form>
            <div class="handle">
              <el-button type="primary" @click="studentAddCourse">
                课时新增
              </el-button>
            </div>
          </div>
        </div>
      </template>
      <div class="content">
        <TitleLine title="课程信息"></TitleLine>
        <div class="table_box">
          <el-table
            border
            stripe
            :data="sudentCoursesList"
            style="width: 100%"
            height="100%"
            @row-click="rowClick"
          >
            <el-table-column
              type="index"
              label="序号"
              width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column label="课程名称" prop="courseName" align="center">
              <template #="{ row }">
                <span>{{ findName(coursesList, row.courseId) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属教师" prop="teacherName" align="center">
              <template #="{ row }">
                <span>{{ findName(teachersList, row.teacherId) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="剩余课时" prop="time" align="center">
              <template #="{ row }">{{ computTimes(row) }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="250">
              <template #="{ row }">
                <el-popconfirm
                  title="确定要删除吗？"
                  @confirm="deleteStudent(row.id)"
                >
                  <template #reference>
                    <el-button size="small" type="danger" @click.stop>
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-button
                  size="small"
                  type="primary"
                  @click.stop="updateBefre(row)"
                >
                  修改
                </el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click.stop="addTime(row)"
                >
                  课时新增
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </Viewer>
    <el-dialog
      class="save_stuednt_dialog"
      width="450"
      v-model="dialogVisible"
      :title="`课程-${formTitle || '详情'}`"
      @closed="clearForm('saveFormRef', 'saveStudentCourseForm')"
    >
      <el-form
        :disabled="!formTitle"
        ref="saveFormRef"
        label-width="120"
        :model="saveStudentCourseForm"
      >
        <el-form-item label="选择课程：" prop="courseId">
          <el-select
            filterable
            v-model="saveStudentCourseForm.courseId"
            placeholder="请输入选择课程"
            @change="formChange('courseId')"
          >
            <el-option
              v-for="item in coursesList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择教师" prop="birthday">
          <el-select v-model="saveStudentCourseForm.teacherId">
            <el-option
              v-for="item in teacherListByCourses"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm(saveFormRef)">
          确 认
        </el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </el-dialog>
    <el-dialog
      class="save_stuednt_dialog"
      width="500"
      v-model="addTimesViasble"
      :title="`课时新增`"
      @closed="clearForm('addFormRef', 'addTimesForm')"
    >
      <el-form ref="addFormRef" label-width="100" :model="addTimesForm">
        <el-form-item label="选择课程：" prop="courseId">
          <el-select
            filterable
            :model-value="curCourse.courseId"
            placeholder="请输入选择课程"
            @change="formChange('courseId')"
            disabled
          >
            <el-option
              v-for="item in coursesList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="选择教师" prop="birthday">
          <el-select v-model="saveStudentCourseForm.teacherId">
            <el-option
              v-for="item in teacherListByCourses"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="充值日期：" prop="date">
          <el-date-picker
            v-model="addTimesForm.date"
            placeholder="请选择充值日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="课时（节）：" prop="times">
          <el-input-number
            v-model="addTimesForm.times"
            placeholder="请输入课程时长"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="折扣（%）：" prop="discount">
          <el-input-number
            v-model="addTimesForm.discount"
            placeholder="请输入折扣"
            :min="50"
            :max="100"
          ></el-input-number>
          <span>{{ computeCountPrise() }}</span>
        </el-form-item>
        <el-form-item label="备注：" prop="des">
          <el-input
            type="textarea"
            v-model="addTimesForm.des"
            placeholder="请输入充值备注"
            :autosize="{ minRows: 4 }"
            resize="none"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitAddForm"> 确 认 </el-button>
        <el-button @click="addTimesViasble = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { FormInstance } from "element-plus";
import { useRoute } from "vue-router";
import { reqGetCoursesList } from "@/api/courses/courses.ts";
import { reqGetTeacherList } from "@/api/teacher/teacher.ts";
import { reqSaveRechargeList } from "@/api/recharge";
import {
  reqDelStudentById,
  reqGetStudentCourses,
  reqSaveStudentCourses,
} from "@/api/student";
import { gradeList } from "@/utils/constants";
import { log } from "util";
const searchForm = ref<any>({}); // 查询表单
const sudentCoursesList = ref<any>([]); //学生列表
const saveStudentCourseForm = ref<any>({}); // 新增修改学生表单
const dialogVisible = ref<any>(false); // 弹窗
const formRef = ref<FormInstance>();
const formTitle = ref<string>("新增"); // 表单标题;
const route: any = useRoute();

const saveFormRef = ref<FormInstance>();
const clearForm = (formKey: string, dataKey: string) => {
  const data: any = { saveStudentCourseForm, addTimesForm };
  const form: any = { saveFormRef, addFormRef };
  data[dataKey].value = {};
  form[formKey]?.value?.resetFields();
};
/* form的item的change事件其实是想那啥删除 教师id值的 */
const formChange = (key?: string) => {
  switch (key) {
    case "courseId":
      saveStudentCourseForm.value.teacherId = "";
      break;
    default:
      break;
  }
};

/* 课时部分-新增*/
const addFormRef = ref<FormInstance>();
const addTimesForm = ref<any>({});
const addTimesViasble = ref<boolean>(false);
const curCourse = ref<any>(); // 记录当前点击的课程 后 完成表单新增到对应课程
const addTime = (row: any) => {
  curCourse.value = { ...row };
  addTimesViasble.value = true;
};
const curCoursePrise = computed(() => {
  const find = coursesList.value.find(
    (item: any) => item.id == curCourse.value.courseId,
  );
  return find?.price;
});
const submitAddForm = () => {
  addFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      const request = {
        ...addTimesForm.value,
        classTimeId: curCourse.value?.id,
      };
      reqSaveRechargeList(request).then((res) => {
        addTimesViasble.value = false;
        getList();
        ElMessage.success(res.message);
      });
    }
  });
};
const computeCountPrise = () => {
  return (
    (curCoursePrise.value *
      addTimesForm.value.discount *
      addTimesForm.value.times) /
      100 || 0
  );
};
/* 找名字 */
const findName = (list: any[], id: string | number) => {
  const find = list.find((f) => f.id === id);
  return find?.name;
};

const coursesList = ref<any>([]);
const coursesListAjax = () => {
  reqGetCoursesList({ pageSize: 999 }).then((res: any) => {
    coursesList.value = res.data.list;
  });
};
coursesListAjax();
const teachersList = ref<any>([]);
const teachersListAjax = () => {
  reqGetTeacherList({ pageSize: 999 }).then((res: any) => {
    teachersList.value = res.data.list;
  });
};
teachersListAjax();
/*  */
const teacherListByCourses = computed(() => {
  const find = coursesList.value.find((item: any) => {
    return item.id == saveStudentCourseForm.value.courseId;
  });
  return (
    find?.teachers?.map((m: string) =>
      teachersList.value.find((item: any) => item.id == m),
    ) || []
  );
});
/* 获取学生列表 */
const getList = () => {
  reqGetStudentCourses(route.params.id).then((res) => {
    sudentCoursesList.value = res.data;
    // pageInfo.value.total = res.data.total;
  });
};
const computTimes = (row: any) => {
  return (
    row?.recharges?.reduce((r, t) => {
      return r + t.times;
    }, 0) || 0
  );
};
const studentAddCourse = () => {
  dialogVisible.value = true;
};
/**
 * 处理点击事件
 *
 * @param val 被点击选项的值，类型为任意类型
 * @param key 存储选项值的对象键名，默认为"saveStudentCourseForm"，类型为字符串
 * @returns 无返回值
 */
const handleClick = (val: any, key: string = "saveStudentCourseForm") => {
  const obj: any = { saveStudentCourseForm, searchForm };
  // 点击选项时，直接将当前选中的值赋值给 selectedOptions
  obj[key].value.grade = ~~val.join("");
};
/* 删除学生 */
const deleteStudent = (id: number | string) => {
  reqDelStudentById(id).then(() => {
    getList();
    ElMessage.success("操作成功");
  });
};
const updateBefre = (row: any) => {
  formTitle.value = "修改";
  dialogVisible.value = true;
  saveStudentCourseForm.value = row;
};
/**
 * 判断表格行是否可见
 *
 * @param row 表格行数据，可选
 * @returns 若表格行数据完整则返回true，否则返回false并弹出错误提示
 */

const submitForm = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate((valid: boolean) => {
    if (valid) {
      const request = {
        ...saveStudentCourseForm.value,
        studentId: route.params.id,
      };
      reqSaveStudentCourses(request).then((res) => {
        dialogVisible.value = false;
        getList();
        ElMessage.success(res.message);
      });
    }
  });
};
const rowClick = (row: any) => {
  formTitle.value = "";
  dialogVisible.value = true;
  saveStudentCourseForm.value = JSON.parse(JSON.stringify(row));
};
getList();
</script>
<style scoped lang="scss">
.student_allocation {
  height: 100%;
  ::v-deep .el-card {
    .el-card__header {
      border-bottom: none !important;
    }
  }
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .form_box {
    width: 100%;
    padding: 20px 0 20px 0;
    .student-info {
      display: flex;
      margin-top: 16px;
    }
    .el-form {
      flex: auto;
      .el-input {
        width: 180px;
      }
      ::v-deep .el-input-number {
        width: 180px;
      }
      ::v-deep .el-cascader {
        width: 180px;
      }
    }
  }
  .table_box {
    flex: 1;
    overflow: hidden;
    padding-top: 10px;
  }
  ::v-deep .save_stuednt_dialog {
    .el-form {
      .el-input,
      .el-select,
      .el-input-number,
      .el-input__wrapper {
        width: 220px !important;
      }
    }
    .guardians_table {
      .handel {
        .cell {
          display: flex;
          justify-content: center;
        }
      }
      .edit_row {
        td {
          padding: 0;
        }
        td .cell {
          padding: 0;
          height: 100% !important;
          .el-input {
            height: 100%;
          }
        }

        td:first-child {
          .cell {
            padding-left: 1px !important;
          }
        }
      }
    }
  }
}
</style>
