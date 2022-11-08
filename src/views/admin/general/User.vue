<template>
  <div class="view">
    <el-card>
      <div slot="header">
        <span class="panel-title home-title">{{ $t('m.General_User') }}</span>
        <div class="filter-row">
          <span>
            <el-button
                icon="el-icon-delete-solid"
                size="small"
                type="danger"
                @click="deleteUsers(null)"
            >{{ $t('m.Delete') }}
            </el-button>
          </span>
          <span>
            <el-button
                icon="el-icon-minus"
                size="small"
                type="warning"
                @click="forbidUsers(null)"
            >{{ $t('m.Forbid') }}
            </el-button>
          </span>
          <span>
            <vxe-input
                v-model="query.keyword"
                :placeholder="$t('m.Enter_keyword')"
                size="medium"
                type="search"
                @search-click="filterByKeyword"
                @keyup.enter.native="filterByKeyword"
            ></vxe-input>
          </span>
<!--          <span>-->
<!--            <el-switch-->
<!--                v-model="onlyAdmin"-->
<!--                :active-text="$t('m.OnlyAdmin')"-->
<!--                :inactive-text="$t('m.All')"-->
<!--                :width="40"-->
<!--                @change="filterByAdmin"-->
<!--            >-->
<!--            </el-switch>-->
<!--          </span>-->
          <span>
            <el-select
                v-model="query.userStatus"
                size="small"
                style="width: 180px;"
                @change="userStatusChange"
            >
              <el-option
                  :label="$t('m.All_User')"
                  :value="-1"
              ></el-option>
              <el-option
                  v-for="(status, index) in USER_STATUS"
                  :key="index"
                  :label="status.label"
                  :value="status.value"
              ></el-option>
            </el-select>
          </span>
          <span>
            <el-select
                v-model="query.userRole"
                size="small"
                style="width: 180px;"
                @change="userRoleChange"
            >
              <el-option
                  :label="$t('m.All_User')"
                  :value="-1"
              ></el-option>
              <el-option
                  v-for="(role, index) in USER_ROLE"
                  :key="index"
                  :label="role.name"
                  :value="role.id"
              ></el-option>
            </el-select>
          </span>
          <span>
            <el-button
                icon="el-icon-check"
                size="small"
                type="primary"
            >{{ $t('m.Pass') }}
            </el-button>
          </span>
          <span>
            <el-button
                icon="el-icon-close"
                size="small"
                type="warning"
            >{{ $t('m.Reject') }}
            </el-button>
          </span>
        </div>
      </div>
      <vxe-table
          ref="xTable"
          :checkbox-config="{ labelField: 'id', highlight: true, range: true }"
          :data="userList"
          :loading="loadingTable"
          auto-resize
          stripe
          @checkbox-change="handleSelectionChange"
          @checkbox-all="handleChangeAll"
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column
            field="uid"
            show-overflow
            title="UUID"
            :visible="false"
        ></vxe-column>
        <vxe-column
            :title="$t('m.User')"
            field="username"
            min-width="120"
            show-overflow
        ></vxe-column>
        <vxe-column
            :title="$t('m.School')"
            field="school"
            min-width="120"
            show-overflow
        ></vxe-column>
        <vxe-column
            :title="$t('m.RealName')"
            field="realname"
            min-width="90"
            show-overflow
        ></vxe-column>
        <vxe-column
            :title="$t('m.Student_Number')"
            field="number"
            min-width="120"
            show-overflow
        ></vxe-column>
        <vxe-column
            :title="$t('m.Email')"
            field="email"
            min-width="170"
            show-overflow
        ></vxe-column>
        <vxe-column
            :title="$t('m.Created_Time')"
            field="gmtCreate"
            min-width="155"
        >
          <template v-slot="{ row }">
            {{ row.gmtCreate | localtime }}
          </template>
        </vxe-column>
        <vxe-column
            :title="$t('m.User_Type')"
            field="role"
            min-width="100"
        >
          <template v-slot="{ row }">
            {{ getRole(row.roles) | parseRole }}
          </template>
        </vxe-column>
        <vxe-column
            :title="$t('m.Status')"
            field="status"
            min-width="90"
        >
          <template v-slot="{ row }">
            {{ row.status | parseStatus }}
          </template>
        </vxe-column>
        <vxe-column :title="$t('m.Option')" min-width="120">
          <template v-slot="{ row }">
            <el-tooltip
                :content="$t('m.Edit_User')"
                effect="dark"
                placement="top"
            >
              <el-button
                  icon="el-icon-edit-outline"
                  size="mini"
                  type="primary"
                  @click.native="openUserDialog(row)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip
                :content="$t('m.Delete_User')"
                effect="dark"
                placement="top"
            >
              <el-button
                  icon="el-icon-delete-solid"
                  size="mini"
                  type="danger"
                  @click.native="deleteUsers([row.uid])"
              >
              </el-button>
            </el-tooltip>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="panel-options">
        <el-pagination
            :page-size="query.pageSize"
            :current-page.sync="query.currentPage"
            :page-sizes="[10, 30, 50, 100]"
            :total="total"
            class="page"
            layout="prev, pager, next, sizes"
            @current-change="currentChange"
            @size-change="onPageSizeChange"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 导入csv用户数据 -->
    <el-card style="margin-top:20px">
      <div slot="header">
        <span class="panel-title home-title">{{ $t('m.Import_User') }}</span>
      </div>
      <p>1. {{ $t('m.Import_User_Tips1') }}</p>
      <p>2. {{ $t('m.Import_User_Tips2') }}</p>
      <p>3. {{ $t('m.Import_User_Tips3') }}</p>
      <p>4. {{ $t('m.Import_User_Tips4') }}</p>
      <p>5. {{ $t('m.Import_User_Tips5') }}</p>
      <el-upload
          v-if="!uploadUsers.length"
          :before-upload="handleUsersCSV"
          :show-file-list="false"
          accept=".csv"
          action=""
      >
        <el-button icon="el-icon-folder-opened" size="small" type="primary">{{
            $t('m.Choose_File')
          }}
        </el-button>
      </el-upload>
      <template v-else>
        <vxe-table :data="uploadUsersPage" auto-resize stripe>
          <vxe-column
              :title="$t('m.Username')"
              field="username"
              min-width="96"
              show-overflow
          >
            <template v-slot="{ row }">
              {{ row[0] }}
            </template>
          </vxe-column>
          <vxe-column
              :title="$t('m.Password')"
              field="password"
              min-width="130"
              show-overflow
          >
            <template v-slot="{ row }">
              {{ row[1] }}
            </template>
          </vxe-column>
          <vxe-column
              :title="$t('m.Email')"
              field="email"
              min-width="120"
              show-overflow
          >
            <template v-slot="{ row }">
              {{ row[2] }}
            </template>
          </vxe-column>
          <vxe-column
              :title="$t('m.RealName')"
              field="realname"
              min-width="150"
              show-overflow
          >
            <template v-slot="{ row }">
              {{ row[3] }}
            </template>
          </vxe-column>
          <vxe-column
              :title="$t('m.Gender')"
              field="gender"
              min-width="60"
              show-overflow
          >
            <template v-slot="{ row }">
              {{ row[4] }}
            </template>
          </vxe-column>
          <vxe-column
              :title="$t('m.Nickname')"
              field="nickname"
              min-width="100"
              show-overflow
          >
            <template v-slot="{ row }">
              {{ row[5] }}
            </template>
          </vxe-column>
          <vxe-column
              :title="$t('m.School')"
              field="school"
              min-width="100"
              show-overflow
          >
            <template v-slot="{ row }">
              {{ row[6] }}
            </template>
          </vxe-column>
        </vxe-table>

        <div class="panel-options">
          <el-button
              icon="el-icon-upload"
              size="small"
              type="primary"
              @click="handleUsersUpload"
          >{{ $t('m.Upload_All') }}
          </el-button>
          <el-button
              icon="el-icon-delete"
              size="small"
              type="danger"
              @click="handleResetData"
          >{{ $t('m.Clear_All') }}
          </el-button>
          <el-pagination
              :current-page.sync="uploadUsersCurrentPage"
              :page-size="uploadUsersPageSize"
              :total="uploadUsers.length"
              class="page"
              layout="prev, pager, next"
          >
          </el-pagination>
        </div>
      </template>
    </el-card>

    <!--生成用户数据-->
    <el-card style="margin-top:20px">
      <div slot="header">
        <span class="panel-title home-title">{{ $t('m.Generate_User') }}</span>
      </div>
      <el-form
          ref="formGenerateUser"
          :model="formGenerateUser"
          :rules="formGenerateRules"
      >
        <el-row :gutter="10">
          <el-col :md="5" :xs="24">
            <el-form-item :label="$t('m.Prefix')" prop="prefix">
              <el-input
                  v-model="formGenerateUser.prefix"
                  placeholder="Prefix"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="5" :xs="24">
            <el-form-item :label="$t('m.Suffix')" prop="suffix">
              <el-input
                  v-model="formGenerateUser.suffix"
                  placeholder="Suffix"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="5" :xs="24">
            <el-form-item :label="$t('m.Start_Number')" prop="number_from">
              <el-input-number
                  v-model="formGenerateUser.number_from"
                  style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="5" :xs="24">
            <el-form-item :label="$t('m.End_Number')" prop="number_to">
              <el-input-number
                  v-model="formGenerateUser.number_to"
                  style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :md="4" :xs="24">
            <el-form-item
                :label="$t('m.Password_Length')"
                prop="password_length"
            >
              <el-input
                  v-model.number="formGenerateUser.password_length"
                  :placeholder="$t('m.Password_Length')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button
              :loading="loadingGenerate"
              icon="fa fa-users"
              size="small"
              type="primary"
              @click="generateUser"
          >
            {{ $t('m.Generate_and_Export') }}
          </el-button>
          <span
              v-if="formGenerateUser.number_from <= formGenerateUser.number_to"
              class="userPreview"
          >
            {{ $t('m.The_usernames_will_be') }}
            {{
              formGenerateUser.prefix +
              formGenerateUser.number_from +
              formGenerateUser.suffix
            }},
            <span
                v-if="
                formGenerateUser.number_from + 1 < formGenerateUser.number_to
              "
            >
              {{
                formGenerateUser.prefix +
                (formGenerateUser.number_from + 1) +
                formGenerateUser.suffix +
                '...'
              }}
            </span>
            <span
                v-if="
                formGenerateUser.number_from + 1 <= formGenerateUser.number_to
              "
            >
              {{
                formGenerateUser.prefix +
                formGenerateUser.number_to +
                formGenerateUser.suffix
              }}
            </span>
          </span>
        </el-form-item>
      </el-form>
    </el-card>

    <!--编辑用户的对话框-->
    <el-dialog
        :title="$t('m.User')"
        :visible.sync="showUserDialog"
        :close-on-click-modal="false"
        width="350px"
    >
      <el-form
          ref="updateUser"
          :model="selectUser"
          :rules="updateUserRules"
          label-position="left"
          label-width="100px"
      >
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item :label="$t('m.Username')" prop="username" required>
              <el-input v-model="selectUser.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.School')" prop="school">
              <el-input v-model="selectUser.school"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.Student_Number')" prop="number">
              <el-input v-model="selectUser.number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.RealName')" prop="realname">
              <el-input v-model="selectUser.realname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.Email')" prop="email">
              <el-input v-model="selectUser.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.Set_New_PWD')">
              <el-switch
                  v-model="selectUser.setNewPwd"
                  :active-value="true"
                  :inactive-value="false"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col v-if="selectUser.setNewPwd == 1" :span="24">
            <el-form-item
                :label="$t('m.General_New_Password')"
                prop="password"
                required
            >
              <el-input
                  v-model="selectUser.password"
                  :placeholder="$t('m.General_New_Password')"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.User_Type')">
              <el-select v-model="selectUser.type">
                <el-option
                    v-for="(role, index) in USER_ROLE"
                    :key="index"
                    :label="role.name"
                    :value="role.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.Status')">
              <el-select v-model="selectUser.status">
                <el-option
                    v-for="(status, index) in USER_STATUS"
                    :key="index"
                    :label="status.label"
                    :value="status.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click.native="showUserDialog = false">{{
            $t('m.Cancel')
          }}</el-button>
        <el-button type="primary" @click.native="saveUser">{{
            $t('m.OK')
          }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import papa from 'papaparse'; // csv插件
import api from '@/common/api';
import utils from '@/common/utils';
import myMessage from '@/common/message';
import {USER_ROLE, USER_STATUS} from '@/common/constants';

export default {
  name: 'user',
  data() {
    const CheckTogtFrom = (rule, value, callback) => {
      if (value < this.formGenerateUser.number_from) {
        callback(
            new Error(
                this.$i18n.t(
                    'm.The_end_number_cannot_be_less_than_the_start_number'
                )
            )
        );
      }
      callback();
    };
    const CheckPwdLength = (rule, value, callback) => {
      if (value < 6 || value > 25) {
        callback(
            new Error(
                this.$i18n.t(
                    'm.Please_select_6_to_25_characters_for_password_length'
                )
            )
        );
      }
      callback();
    };
    const CheckUsernameNotExist = (rule, value, callback) => {
      api.checkUsernameOrEmail(value, undefined).then(
          (res) => {
            if (
                res.data.data.username === true &&
                value != this.selectUser.username
            ) {
              callback(new Error(this.$i18n.t('m.The_username_already_exists')));
            } else {
              callback();
            }
          },
          (_) => callback()
      );
    };
    const CheckEmailNotExist = (rule, value, callback) => {
      api.checkUsernameOrEmail(undefined, value).then(
          (res) => {
            if (res.data.data.email === true && value != this.selectUser.email) {
              callback(new Error(this.$i18n.t('m.The_email_already_exists')));
            } else {
              callback();
            }
          },
          (_) => callback()
      );
    };
    return {
      // 用户总数
      total: 0,
      // 数据库查询的用户列表
      userList: [],
      uploadUsers: [],
      uploadUsersPage: [],
      uploadUsersCurrentPage: 1,
      uploadUsersPageSize: 15,
      query: {
        userStatus: -1,
        userRole: -1,
        keyword: '',
        pageSize: 10,
        currentPage: 1,
      },
      // 是否显示用户对话框
      showUserDialog: false,
      onlyAdmin: false,
      USER_STATUS: [],
      USER_ROLE: [],
      // 当前用户model
      selectUser: {
        uid: '',
        username: '',
        realname: '',
        school: '',
        number: '',
        email: '',
        password: '',
        type: 1002,
        status: 0,
        setNewPwd: false,
      },
      updateUserRules: {
        username: [
          {required: true, message: 'Username is required', trigger: 'blur'},
          {
            validator: CheckUsernameNotExist,
            trigger: 'blur',
            message: this.$i18n.t('m.The_username_already_exists'),
          },
          {
            max: 255,
            message: this.$i18n.t('m.Username_Check_Max'),
            trigger: 'blur',
          },
        ],
        realname: [
          {
            max: 255,
            trigger: 'blur',
          },
        ],
        email: [
          {
            type: 'email',
            message: this.$i18n.t('m.Email_Check_Format'),
            trigger: 'blur',
          },
          {
            validator: CheckEmailNotExist,
            message: this.$i18n.t('m.The_email_already_exists'),
            trigger: 'blur',
          },
        ],
      },
      loadingTable: false,
      loadingGenerate: false,

      selectedUsers: [],
      formGenerateUser: {
        prefix: '',
        suffix: '',
        number_from: 0,
        number_to: 10,
        password_length: 8,
      },
      formGenerateRules: {
        number_from: [
          {
            required: true,
            message: this.$i18n.t('m.Start_Number_Required'),
            trigger: 'blur',
          },
        ],
        number_to: [
          {
            required: true,
            message: this.$i18n.t('m.End_Number_Required'),
            trigger: 'blur',
          },
          {validator: CheckTogtFrom, trigger: 'blur'},
        ],
        password_length: [
          {
            required: true,
            message: this.$i18n.t('m.Password_Check_Required'),
            trigger: 'blur',
          },
          {
            type: 'number',
            message: this.$i18n.t('m.Password_Length_Checked'),
            trigger: 'blur',
          },
          {validator: CheckPwdLength, trigger: 'blur'},
        ],
      },
    };
  },
  created() {
    this.USER_STATUS = Object.assign({}, USER_STATUS);
    this.USER_ROLE = Object.assign({}, USER_ROLE);
  },
  mounted() {
    this.getUserList(1);
  },
  methods: {
    userStatusChange(){
      this.getUserList(1);
    },
    userRoleChange(){
      this.getUserList(1);
    },
    // 切换页码回调
    currentChange(page) {
      this.query.currentPage = page;
      this.getUserList(page);
    },
    onPageSizeChange(pageSize) {
      this.query.pageSize = pageSize;
      this.getUserList(this.query.currentPage);
    },
    // 提交修改用户的信息
    saveUser() {
      this.$refs['updateUser'].validate((valid) => {
        if (valid) {
          api
              .admin_editUser(this.selectUser)
              .then((res) => {
                // 更新列表
                myMessage.success(this.$i18n.t('m.Update_Successfully'));
                this.getUserList(this.query.currentPage);
              })
              .then(() => {
                this.showUserDialog = false;
              })
              .catch(() => {
              });
        }
      });
    },
    filterByKeyword() {
      this.currentChange(1);
    },
    filterByAdmin() {
      this.currentChange(1);
    },
    getRole(roles) {
      return roles[0]['id'];
    },
    // 打开用户对话框
    openUserDialog(row) {
      this.showUserDialog = true;
      this.selectUser.uid = row.uid;
      this.selectUser.username = row.username;
      this.selectUser.school = row.school;
      this.selectUser.number = row.number;
      this.selectUser.realname = row.realname;
      this.selectUser.email = row.email;
      this.selectUser.setNewPwd = false;
      this.selectUser.password = '';
      this.selectUser.type = this.getRole(row.roles);
      this.selectUser.status = row.status;
    },
    // 获取用户列表
    getUserList(page) {
      let params = {
        limit: this.query.pageSize,
        currentPage: page,
        keyword: this.query.keyword,
        status: this.query.userStatus === -1 ? null : this.query.userStatus,
        roleId: this.query.userRole === -1 ? null : this.query.userRole,
      };
      this.loadingTable = true;
      api
          .admin_getUserList(params)
          .then(
              (res) => {
                this.loadingTable = false;
                this.total = res.data.data.total;
                this.userList = res.data.data.records;
              },
              (res) => {
                this.loadingTable = false;
              }
          );
    },
    deleteUsers(ids) {
      if (!ids) {
        ids = this.selectedUsers;
      }
      if (ids.length > 0) {
        this.$confirm(this.$i18n.t('m.Delete_User_Tips'), 'Tips', {
          confirmButtonText: this.$i18n.t('m.OK'),
          cancelButtonText: this.$i18n.t('m.Cancel'),
          type: 'warning',
        }).then(
            () => {
              api
                  .admin_deleteUsers(ids)
                  .then((res) => {
                    myMessage.success(this.$i18n.$t('m.Delete_successfully'));
                    this.selectedUsers = [];
                    this.getUserList(this.query.currentPage);
                  })
                  .catch(() => {
                    this.selectedUsers = [];
                    this.getUserList(this.query.currentPage);
                  });
            },
            () => {
            }
        );
      } else {
        myMessage.warning(
            this.$i18n.t('m.The_number_of_users_selected_cannot_be_empty')
        );
      }
    },
    forbidUsers(ids) {
      if (!ids) {
        ids = this.selectedUsers;
      }
      if (ids.length > 0) {
        this.$confirm(this.$i18n.t('m.Forbid_User_Tips'), 'Tips', {
          confirmButtonText: this.$i18n.t('m.OK'),
          cancelButtonText: this.$i18n.t('m.Cancel'),
          type: 'warning',
        }).then(
            () => {
              api
                  .admin_forbidUsers(ids)
                  .then((res) => {
                    myMessage.success(this.$i18n.$t('m.Forbid_successfully'));
                    this.selectedUsers = [];
                    this.getUserList(this.query.currentPage);
                  })
                  .catch(() => {
                    this.selectedUsers = [];
                    this.getUserList(this.query.currentPage);
                  });
            },
            () => {
            }
        );
      } else {
        myMessage.warning(
            this.$i18n.t('m.The_number_of_users_selected_cannot_be_empty')
        );
      }
    },

    // 用户表部分勾选 改变选中的内容
    handleSelectionChange({records}) {
      this.selectedUsers = [];
      for (let num = 0; num < records.length; num++) {
        this.selectedUsers.push(records[num].uid);
      }
    },
    // 一键全部选中，改变选中的内容列表
    handleChangeAll() {
      let userList = this.$refs.xTable.getCheckboxRecords();
      this.selectedUsers = [];
      for (let num = 0; num < userList.length; num++) {
        this.selectedUsers.push(userList[num].uid);
      }
    },
    generateUser() {
      this.$refs['formGenerateUser'].validate((valid) => {
        if (!valid) {
          myMessage.error(this.$i18n.t('m.Error_Please_check_your_choice'));
          return;
        }
        this.loadingGenerate = true;
        let data = Object.assign({}, this.formGenerateUser);
        api
            .admin_generateUser(data)
            .then((res) => {
              this.loadingGenerate = false;
              myMessage.success(res.data.msg);
              let url = '/api/file/generate-user-excel?key=' + res.data.data.key;
              utils.downloadFile(url).then(() => {
                this.$alert(this.$i18n.t('m.Generate_User_Success'), 'Tips');
              });
              this.getUserList(1);
            })
            .catch(() => {
              this.loadingGenerate = false;
            });
      });
    },
    handleUsersCSV(file) {
      papa.parse(file, {
        complete: (results) => {
          let data = results.data.filter((user) => {
            return user[0] && user[1];
          });
          let delta = results.data.length - data.length;
          if (delta > 0) {
            myMessage.warning(
                delta + this.$i18n.t('m.Generate_Skipped_Reason')
            );
          }
          this.uploadUsersCurrentPage = 1;
          this.uploadUsers = data;
          this.uploadUsersPage = data.slice(0, this.uploadUsersPageSize);
        },
        error: (error) => {
          myMessage.error(error);
        },
      });
    },
    handleUsersUpload() {
      api
          .admin_importUsers(this.uploadUsers)
          .then((res) => {
            this.getUserList(1);
            this.handleResetData();
            myMessage.success(this.$i18n.t('m.Upload_Users_Successfully'));
          })
          .catch(() => {
          });
    },
    handleResetData() {
      this.uploadUsers = [];
    },
  },
  computed: {
    selectedUserIDs() {
      let ids = [];
      for (let user of this.selectedUsers) {
        ids.push(user.id);
      }
      return ids;
    },
  },
  watch: {
    uploadUsersCurrentPage(page) {
      this.uploadUsersPage = this.uploadUsers.slice(
          (page - 1) * this.uploadUsersPageSize,
          page * this.uploadUsersPageSize
      );
    },
  },
};
</script>

<style scoped>
.import-user-icon {
  color: #555555;
  margin-left: 4px;
}

.userPreview {
  padding-left: 10px;
}

/deep/ .el-tag--dark {
  border-color: #fff;
}

/deep/ .el-dialog__body {
  padding-bottom: 0;
}

.notification p {
  margin: 0;
  text-align: left;
}

.filter-row {
  margin-top: 10px;
}

@media screen and (max-width: 768px) {
  .filter-row span {
    margin-right: 5px;
  }
}

@media screen and (min-width: 768px) {
  .filter-row span {
    margin-right: 20px;
  }
}
</style>
