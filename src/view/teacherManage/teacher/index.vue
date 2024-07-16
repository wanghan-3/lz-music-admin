<!--
 * @Descripttion: 
 * @Author: Wang Xi
 * @version: 
 * @Date: 2024-07-13 18:43:04
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-15 23:41:02
-->
<template>
  <div class="teacher_manage">
    <Viewer>
      <template #header>
        <div class="form_box">
          <el-form ref="formRef" :model="searchForm" label-width="auto" inline>
            <el-form-item label="教师姓名：" prop="name">
              <el-input
                v-model="searchForm.name"
                placeholder="请输入教师姓名"
              />
            </el-form-item>
          </el-form>
          <div class="handle">
            <el-button @click="resetForm(formRef)">重置</el-button>
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button
              type="primary"
              @click="
                dialogVisible = true;
                formTitle = '新增';
              "
            >
              新增
            </el-button>
          </div>
        </div>
      </template>
      <div class="table_box">
        <el-table
          border
          stripe
          :data="coursesList"
          style="width: 100%; margin-top: 20px"
          height="100%"
          @row-click="rowClick"
        >
          <el-table-column type="index" label="序号" width="60" align="center">
          </el-table-column>
          <el-table-column
            label="教师姓名"
            width="100"
            prop="name"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="教师年龄"
            width="100"
            prop="age"
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="200"
            label="电话号码"
            prop="phone"
            align="center"
          >
          </el-table-column>
          <el-table-column label="教学特色" prop="bio" align="center">
          </el-table-column>
          <!-- <el-table-column label="课程描述" prop="des" align="center">
          </el-table-column> -->
          <el-table-column label="操作" align="center" width="150">
            <template #="{ row }">
              <el-popconfirm
                title="确定要删除吗？"
                @confirm="deleteStudent(row.id)"
              >
                <template #reference>
                  <el-button size="small" @click.stop="" type="danger">
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
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
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
      width="600"
      v-model="dialogVisible"
      :title="`课程管理-${formTitle || '详情'}`"
      ref="saveFormRef"
      @close="clearSaveForm"
    >
      <el-form
        :disabled="!formTitle"
        ref="saveFormRef"
        label-width="120"
        :model="saveCourseForm"
      >
        <el-form-item label="教师姓名：" prop="name">
          <el-input
            v-model="saveCourseForm.name"
            placeholder="请输入教师姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="年龄：" prop="age">
          <el-input-number
            v-model="saveCourseForm.age"
            placeholder="请输入年龄"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-select v-model="saveCourseForm.sex" placeholder="请选择性别">
            <el-option
              v-for="se in sexList"
              :value="se.id"
              :label="se.value"
              :key="se.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码：" prop="phone">
          <el-input
            v-model="saveCourseForm.phone"
            placeholder="请输入电话号码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="教学特色：" prop="bio">
          <el-input
            type="textarea"
            v-model="saveCourseForm.bio"
            placeholder="请输入课程描述"
            :autosize="{ minRows: 4 }"
            style="width: 400px"
            resize="none"
          ></el-input>
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
import Viewer from "@/components/Viewer/index.vue";
import { ref, nextTick } from "vue";
import { FormInstance } from "element-plus";
import { reqGetTeacherList, reqSaveTeacher } from "@/api/teacher/teacher";
import { sexList } from "@/utils/constants";
const searchForm = ref<any>({}); // 查询表单
const coursesList = ref<any>([]); //学生列表
const saveCourseForm = ref<any>({
  guardians: [],
  grade: 0,
}); // 新增修改学生表单
const dialogVisible = ref<any>(false); // 弹窗
const formRef = ref<FormInstance>();
const inputRef = ref<FormInstance>();
const formTitle = ref<string>("新增"); // 表单标题;

const pageInfo = ref<any>({
  pageNo: 1,
  pageSize: 10,
});
const pagesChange = () => {
  getList();
};

const saveFormRef = ref<FormInstance>();
const clearSaveForm = () => {
  saveFormRef?.value?.resetFields();
  saveCourseForm.value = {};
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getList();
};
/* 获取学生列表 */
const getList = () => {
  reqGetTeacherList({ ...searchForm.value, ...pageInfo.value }).then(
    (res: any) => {
      coursesList.value = res.data.list;
      pageInfo.value.total = res.data.total;
    },
  );
};

/**
 * 处理点击事件
 *
 * @param val 被点击选项的值，类型为任意类型
 * @param key 存储选项值的对象键名，默认为"saveCourseForm"，类型为字符串
 * @returns 无返回值
 */
const handleClick = (val: any, key: string = "saveCourseForm") => {
  const obj: any = { saveCourseForm, searchForm };
  // 点击选项时，直接将当前选中的值赋值给 selectedOptions
  obj[key].value.grade = ~~val.join("");
};
/**
 * 添加监护人
 *
 * @returns 无返回值
 */
const addGuardians = () => {
  const form = saveCourseForm.value;
  const row = form.guardians[form.guardians.length - 1];
  if (visableRow(row)) {
    saveCourseForm.value.guardians.push({ edit: true });
    row && (row.edit = false);
  }
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
  saveCourseForm.value = JSON.parse(JSON.stringify(row));
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
const relationInputChange = (e: any, row: any, type?: string) => {
  console.log(e, "123456");

  if (type === "sel") {
    if (e === -1) {
      nextTick(() => {
        inputRef?.value?.focus();
      });
    }
  } else {
    row.relation = e;
    console.log(row.relation);
  }
};
const blur = (val: any, row: any) => {
  if (!val) {
    row.relationVal = "";
    row.relation = "";
  }
};
const rowClass = (row: any) => {
  return row.row.edit ? "edit_row" : "";
};
const handelEditOk = (row: any) => {
  if (row.edit && !visableRow(row)) return;
  row.edit = !row.edit;
};
const submitForm = async (formEl: any) => {
  if (!formEl) return;
  await formEl.validate((valid: boolean) => {
    if (valid) {
      reqSaveTeacher(saveCourseForm.value).then((res: any) => {
        ElMessage.success(res.message);
        dialogVisible.value = false;
        getList();
      });
    }
  });
};
const rowClick = (row: any) => {
  formTitle.value = "";
  dialogVisible.value = true;
  saveCourseForm.value = JSON.parse(JSON.stringify(row));
};
getList();
</script>
<style scoped lang="scss">
.teacher_manage {
  height: 100%;
  .form_box {
    display: flex;
    width: 100%;
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
    height: 100%;
    flex: 1;
  }
  ::v-deep .save_stuednt_dialog {
    .el-form {
      .el-input,
      .el-select,
      .el-input-number {
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
