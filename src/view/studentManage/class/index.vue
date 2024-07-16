<!--
 * @Descripttion: 
 * @Author: Wang Xi
 * @version: 
 * @Date: 2024-07-13 18:43:04
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-13 19:09:53
-->
<template>
  <div class="student_manage">
    <Viewer>
      <template #header>
        <div class="form_box">
          <el-form ref="formRef" :model="searchForm" label-width="auto" inline>
            <el-form-item label="课程名称：" prop="name">
              <el-input
                v-model="searchForm.name"
                placeholder="请输入课程名称"
              />
            </el-form-item>
            <el-form-item label="学生年龄：" prop="age">
              <el-input-number
                :min="3"
                v-model="searchForm.age"
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
                  String(searchForm.grade)
                    .split('')
                    .map((m) => Number(m))
                "
                @change="handleClick($event, 'searchForm')"
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
          :data="studentList"
          style="width: 100%; margin-top: 20px"
          height="100%"
          @row-click="rowClick"
        >
          <el-table-column type="index" label="序号" width="100" align="center">
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
          <el-table-column label="姓名" prop="name" align="center">
          </el-table-column>
          <el-table-column label="年龄" prop="age" align="center">
          </el-table-column>
          <el-table-column label="性别" prop="sex" align="center">
            <template #="{ row }">
              {{ sexList.find((item) => item.id === row.sex)?.value }}
            </template>
          </el-table-column>
          <el-table-column label="年级" prop="grade" align="center">
            <template #="{ row: { grade } }">
              {{ findGradeById(grade) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template #="{ row }">
              <el-popconfirm
                title="确定要删除吗？"
                @confirm="deleteStudent(row.id)"
              >
                <template #reference>
                  <el-button size="small" type="danger"> 删除 </el-button>
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
      :title="`学生-${formTitle || '详情'}`"
      ref="saveFormRef"
      @close="clearSaveForm"
    >
      <el-form
        :disabled="!formTitle"
        ref="saveFormRef"
        label-width="120"
        :model="saveStudentForm"
      >
        <el-form-item label="课程名称：" prop="name">
          <el-input
            v-model="saveStudentForm.name"
            placeholder="请输入课程名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="出生日期：" prop="birthday">
          <el-date-picker
            v-model="saveStudentForm.birthday"
            placeholder="请选择出生日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="学生年级：" prop="grade">
          <!-- 
            @change="handleChange"
           -->
          <el-cascader
            placeholder="选择学生年级"
            :props="{ value: 'id', label: 'name' }"
            :options="gradeList"
            :model-value="
              String(saveStudentForm.grade)
                .split('')
                .map((m) => Number(m))
            "
            @change="handleClick"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="学生性别：" prop="sex">
          <el-select v-model="saveStudentForm.sex">
            <el-option
              v-for="se in sexList"
              :value="se.id"
              :label="se.value"
              :key="se.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监护人信息：" prop="guardians">
          <el-button
            type="primary"
            size="small"
            @click="addGuardians"
            v-if="formTitle"
          >
            新增监护人
          </el-button>
          <el-table
            :data="saveStudentForm.guardians"
            stripe
            border
            :row-class-name="rowClass"
            class="guardians_table"
          >
            <el-table-column label="姓名" prop="name">
              <template #="{ row }">
                <el-input
                  style="width: 100% !important"
                  v-model="row.name"
                  v-if="row.edit"
                ></el-input>
                <span v-else>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系方式" prop="phone">
              <template #="{ row }">
                <el-input
                  style="width: 100% !important"
                  v-model="row.phone"
                  v-if="row.edit"
                ></el-input>
                <span v-else>{{ row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column label="关系" prop="relation">
              <template #="{ row }">
                <template v-if="row.edit">
                  <el-select
                    style="width: 100% !important"
                    v-model="row.relation"
                    v-if="row.relation !== -1 && !row.relationVal"
                    @Change="relationInputChange($event, row, 'sel')"
                  >
                    <el-option
                      v-for="op in relationshipList"
                      :key="op.id"
                      :label="op.value"
                      :value="op.id"
                    ></el-option>
                  </el-select>
                  <el-input
                    style="width: 100% !important"
                    autofocus
                    v-else
                    v-model="row.relationVal"
                    @blur="blur($event.target.value, row)"
                    ref="inputRef"
                  ></el-input>
                </template>
                <span v-else>{{ row.relationVal || row.relation }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120"
              v-if="formTitle"
              class-name="handel"
            >
              <template #="{ row }">
                <el-button size="small" type="danger">删除</el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="handelEditOk(row)"
                  >{{ row.edit ? "确定" : "編輯" }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-input v-model="saveStudentForm.guardians"></el-input> -->
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
import Viewer from "@/components/Viewer/index.vue";
import { ref, nextTick } from "vue";
import { FormInstance } from "element-plus";
import {
  reqGetStudentList,
  reqDelStudentById,
  reqSaveStudent,
} from "@/api/student";
import { sexList, gradeList, relationshipList } from "@/utils/constants";
const searchForm = ref<any>({}); // 查询表单
const studentList = ref<any>([]); //学生列表
const saveStudentForm = ref<any>({
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
  saveStudentForm.value = {};
  saveFormRef?.value?.resetFields();
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getList();
};
/* 获取学生列表 */
const getList = () => {
  console.log(searchForm, "searchForm");
  reqGetStudentList(searchForm.value).then((res) => {
    studentList.value = res.data.list;
    pageInfo.value.total = res.data.total;
  });
};

/**
 * 处理点击事件
 *
 * @param val 被点击选项的值，类型为任意类型
 * @param key 存储选项值的对象键名，默认为"saveStudentForm"，类型为字符串
 * @returns 无返回值
 */
const handleClick = (val: any, key: string = "saveStudentForm") => {
  const obj: any = { saveStudentForm, searchForm };
  // 点击选项时，直接将当前选中的值赋值给 selectedOptions
  obj[key].value.grade = ~~val.join("");
};
/**
 * 添加监护人
 *
 * @returns 无返回值
 */
const addGuardians = () => {
  const form = saveStudentForm.value;
  const row = form.guardians[form.guardians.length - 1];
  if (visableRow(row)) {
    saveStudentForm.value.guardians.push({ edit: true });
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
  saveStudentForm.value = row;
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
      let guardians: any[] = [];
      saveStudentForm.value.guardians.forEach((ele: any) => {
        delete ele.edit;
        guardians.push(ele);
      });
      reqSaveStudent({ ...saveStudentForm.value, guardians }).then((res) => {
        ElMessage.success(res.message);
        dialogVisible.value = false;
      });
    }
  });
};
const rowClick = (row: any) => {
  formTitle.value = "";
  dialogVisible.value = true;
  saveStudentForm.value = row;
};
getList();
</script>
<style scoped lang="scss">
.student_manage {
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
