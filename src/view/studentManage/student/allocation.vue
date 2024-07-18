<!--
 * @Descripttion: 
 * @Author: Wang Xi
 * @version: 
 * @Date: 2024-06-05 23:43:04
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-18 23:36:56
-->
<template>
  <div class="student_allocation">
    <Viewer>
      <template #header>
        <div class="form_box">
          <TitleLine title="学生信息"></TitleLine>
          <div class="student-info">
            <el-form
              disabled="true
          "
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
                  :min="3"
                  v-model="route.query.age"
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
                课程新增
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
            <!-- <el-table-column prop="valueName" label="属性值名称" align="center">
          <template #="{ row, $index }">
            <p
              v-if="!row.edit"
              @click="edit(row, $index)"
              style="cursor: pointer"
            >
              {{ row.valueName }}
            </p>
            <el-input
              :ref="(r: any) => (inputRef[$index] = r)"
              @blur="inputBlur(row)"
              v-else
              v-model="row.valueName"
              @change="inputChange($event)"
            ></el-input>
          </template>
        </el-table-column> -->
            <el-table-column label="姓名" prop="courseName" align="center">
            </el-table-column>
            <el-table-column label="所属教师" prop="teacherName" align="center">
            </el-table-column>
            <el-table-column label="剩余课时" prop="time" align="center">
              <template #="{ row }">{{ row.time || "0" }} </template>
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
                  @click.stop="updateBefre(row)"
                >
                  课程分配
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <!-- <el-pagination
            :current-page="pageInfo.pageNo"
            :page-size="pageInfo.pageSize"
            :page-sizes="[3, 5, 10, 20]"
            layout="prev,pager,next,jumper,->,total,sizes"
            :total="pageInfo.total"
            background
          /> -->
        <el-pagination
          v-model:current-page="pageInfo.pageNo"
          v-model:page-size="pageInfo.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          background
          layout="prev,pager,next,jumper,->,total,sizes"
          :total="pageInfo.total"
          @size-change="pagesChange"
          @current-change="pagesChange"
        />
        <!-- <el-pagination layout="prev, pager, next" :total="50" /> -->
      </template>
    </Viewer>
    <el-dialog
      class="save_stuednt_dialog"
      width="700"
      v-model="dialogVisible"
      :title="`课程-${formTitle || '详情'}`"
      ref="saveFormRef"
      @closed="clearSaveForm"
    >
      <el-form
        :disabled="!formTitle"
        ref="saveFormRef"
        label-width="120"
        :model="saveStudentCourseForm"
      >
        <el-form-item label="选择课程：" prop="coursesInfo">
          <el-select
            filterable
            v-model="saveStudentCourseForm.id"
            placeholder="请输入选择课程"
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
  </div>
</template>

<script lang="ts" setup>
import { findGradeById } from "@/utils";
import { ref, nextTick, computed } from "vue";
import { FormInstance } from "element-plus";
import { useRoute } from "vue-router";
import { reqGetCoursesList } from "@/api/courses/courses.ts";
import { reqGetTeacherList } from "@/api/teacher/teacher.ts";
import {
  reqDelStudentById,
  reqGetStudentCourses,
  reqSaveStudentCourses,
} from "@/api/student";
import { sexList, gradeList } from "@/utils/constants";
const searchForm = ref<any>({}); // 查询表单
const sudentCoursesList = ref<any>([]); //学生列表
const saveStudentCourseForm = ref<any>({}); // 新增修改学生表单
const dialogVisible = ref<any>(false); // 弹窗
const formRef = ref<FormInstance>();
const inputRef = ref<FormInstance>();
const formTitle = ref<string>("新增"); // 表单标题;

const pageInfo = ref<any>({
  pageNo: 1,
  pageSize: 10,
});
const route: any = useRoute();
const pagesChange = () => {
  getList();
};

const saveFormRef = ref<FormInstance>();
const clearSaveForm = () => {
  saveStudentCourseForm.value = {};
  saveFormRef?.value?.resetFields();
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
    return item.id == saveStudentCourseForm.value.id;
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
const visableRow = (row?: any) => {
  let keys = ["name", "phone", "relation"];
  let isOk = true;
  row &&
    keys.every((key: string) => {
      isOk =
        key == "relation"
          ? row.relation == -1
            ? row.relationVal
            : row.relation
          : row[key];
      return isOk;
    });
  !isOk && ElMessage.error(`请填写完整信息`);
  return isOk;
};

const submitForm = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate((valid: boolean) => {
    if (valid) {
      const request = {
        ...saveStudentCourseForm.value,
        courseName: coursesList.value.find(
          (f: any) => f.id == saveStudentCourseForm.value.id,
        )?.name,
        teacherName: teachersList.value.find(
          (f: any) => f.id == saveStudentCourseForm.value.teacherId,
        )?.name,
      };
      console.log(request, "request");

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
