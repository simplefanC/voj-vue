<template>
  <div>
    <el-card>
      <div slot="header">
        <span class="panel-title home-title">{{
            $t('m.Training_Problem_List')
          }}</span>
        <div class="filter-row">
          <span>
            <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addProblemDialogVisible = true"
            >{{ $t('m.Add_From_Public_Problem') }}
            </el-button>
          </span>
          <span>
            <el-button
                icon="el-icon-plus"
                size="small"
                type="success"
                @click="AddRemoteOJProblemDialogVisible = true"
            >{{ $t('m.Add_Remote_OJ_Problem') }}
            </el-button>
          </span>
          <span>
            <vxe-input
                v-model="keyword"
                :placeholder="$t('m.Enter_keyword')"
                size="medium"
                type="search"
                @search-click="filterByKeyword"
                @keyup.enter.native="filterByKeyword"
            ></vxe-input>
          </span>
        </div>
      </div>
      <vxe-table
          ref="adminProblemList"
          :data="problemList"
          :loading="loading"
          align="center"
          auto-resize
          stripe
      >
        <vxe-table-column field="id" min-width="64" title="ID">
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Display_ID')"
            field="problemId"
            min-width="100"
        >
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Title')"
            field="title"
            min-width="150"
            show-overflow
        >
        </vxe-table-column>

        <vxe-table-column
            :title="$t('m.Author')"
            field="author"
            min-width="100"
            show-overflow
        >
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Training_Problem_Rank')"
            min-width="200"
        >
          <template v-slot="{ row }">
            <el-input-number
                v-model="trainingProblemMap[row.id].rank"
                :max="2147483647"
                :min="0"
                @change="handleChangeRank(trainingProblemMap[row.id])"
            ></el-input-number>
          </template>
        </vxe-table-column>
        <vxe-table-column :title="$t('m.Auth')" min-width="120">
          <template v-slot="{ row }">
            <el-select
                v-model="row.auth"
                :disabled="!isSuperAdmin && !isProblemAdmin"
                size="small"
                @change="changeProblemAuth(row)"
            >
              <el-option
                  :disabled="!isSuperAdmin && !isProblemAdmin"
                  :label="$t('m.Public_Problem')"
                  :value="1"
              ></el-option>
              <el-option
                  :label="$t('m.Private_Problem')"
                  :value="2"
              ></el-option>
              <el-option
                  :disabled="true"
                  :label="$t('m.Contest_Problem')"
                  :value="3"
              ></el-option>
            </el-select>
          </template>
        </vxe-table-column>
        <vxe-table-column min-width="200" title="Option">
          <template v-slot="{ row }">
            <el-tooltip
                v-if="
                isSuperAdmin ||
                  isProblemAdmin ||
                  row.author == userInfo.username
              "
                :content="$t('m.Edit')"
                effect="dark"
                placement="top"
            >
              <el-button
                  icon="el-icon-edit-outline"
                  size="mini"
                  type="primary"
                  @click.native="goEdit(row.id)"
              >
              </el-button>
            </el-tooltip>

            <el-tooltip
                v-if="isSuperAdmin || isProblemAdmin"
                :content="$t('m.Download_Testcase')"
                effect="dark"
                placement="top"
            >
              <el-button
                  icon="el-icon-download"
                  size="mini"
                  type="success"
                  @click.native="downloadTestCase(row.id)"
              >
              </el-button>
            </el-tooltip>

            <el-tooltip :content="$t('m.Remove')" effect="dark" placement="top">
              <el-button
                  icon="el-icon-close"
                  size="mini"
                  type="warning"
                  @click.native="removeProblem(row.id)"
              >
              </el-button>
            </el-tooltip>

<!--            <el-tooltip-->
<!--                v-if="isSuperAdmin || isProblemAdmin"-->
<!--                :content="$t('m.Delete')"-->
<!--                effect="dark"-->
<!--                placement="top"-->
<!--            >-->
<!--              <el-button-->
<!--                  icon="el-icon-delete-solid"-->
<!--                  size="mini"-->
<!--                  type="danger"-->
<!--                  @click.native="deleteProblem(row.id)"-->
<!--              >-->
<!--              </el-button>-->
<!--            </el-tooltip>-->
          </template>
        </vxe-table-column>
      </vxe-table>

      <div class="panel-options">
        <el-pagination
            :page-size="pageSize"
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

    <el-dialog
        :title="$t('m.Add_Training_Problem')"
        :visible.sync="addProblemDialogVisible"
        width="90%"
        :close-on-click-modal="false"
    >
      <AddPublicProblem
          :trainingID="trainingId"
          @on-change="getProblemList"
      ></AddPublicProblem>
    </el-dialog>

    <el-dialog
        :title="$t('m.Add_Remote_OJ_Problem')"
        :visible.sync="AddRemoteOJProblemDialogVisible"
        width="350px"
        :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item :label="$t('m.Remote_OJ')">
          <el-select v-model="otherOJName" size="small">
            <el-option
                v-for="(remoteOj, index) in REMOTE_OJ"
                :key="index"
                :label="remoteOj.name"
                :value="remoteOj.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('m.Problem_ID')" required>
          <el-input v-model="otherOJProblemId" size="small"></el-input>
        </el-form-item>

        <el-form-item style="text-align:center">
          <el-button
              :loading="addRemoteOJproblemLoading"
              icon="el-icon-plus"
              type="primary"
              @click="addRemoteOJProblem"
          >{{ $t('m.Add') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/common/api';
import AddPublicProblem from '@/components/admin/AddPublicProblem.vue';
import myMessage from '@/common/message';
import {REMOTE_OJ} from '@/common/constants';
import {mapGetters} from 'vuex';
import utils from '@/common/utils';

export default {
  name: 'ProblemList',
  components: {
    AddPublicProblem,
  },
  data() {
    return {
      problemListAuth: 0,
      oj: 'All',
      pageSize: 10,
      total: 0,
      problemList: [],
      trainingProblemMap: {},
      keyword: '',
      loading: false,
      currentPage: 1,
      routeName: '',
      trainingId: '',
      // for make public use
      currentProblemID: '',
      currentRow: {},
      addProblemDialogVisible: false,
      AddRemoteOJProblemDialogVisible: false,
      addRemoteOJproblemLoading: false,
      otherOJName: 'HDU',
      otherOJProblemId: '',
      REMOTE_OJ: {},
      displayId: '',
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapGetters(['userInfo', 'isSuperAdmin', 'isProblemAdmin']),
  },
  methods: {
    init() {
      this.routeName = this.$route.name;
      this.trainingId = this.$route.params.trainingId;
      this.getProblemList(this.currentPage);
      this.REMOTE_OJ = Object.assign({}, REMOTE_OJ);
    },

    goEdit(problemId) {
      this.$router.push({
        name: 'admin-edit-problem',
        params: {problemId: problemId},
      });
    },
    // 切换页码回调
    currentChange(page) {
      this.currentPage = page;
      this.getProblemList(page);
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getProblemList(this.currentPage);
    },
    getProblemList(page = 1) {
      this.loading = true;
      let params = {
        limit: this.pageSize,
        currentPage: page,
        keyword: this.keyword,
        tid: this.trainingId,
        queryExisted: true,
      };
      if (this.problemListAuth != 0) {
        params['auth'] = this.problemListAuth;
      }
      api.admin_getTrainingProblemList(params).then(
          (res) => {
            this.loading = false;
            this.total = res.data.data.problemList.total;
            this.problemList = res.data.data.problemList.records;
            this.trainingProblemMap = res.data.data.trainingProblemMap;
          },
          (err) => {
            this.loading = false;
          }
      );
    },
    handleChangeRank(data) {
      api.admin_updateTrainingProblem(data).then((res) => {
        myMessage.success(this.$i18n.t('m.Update_Successfully'));
        this.getProblemList(1);
      });
    },
    changeProblemAuth(row) {
      api.admin_changeProblemAuth(row).then((res) => {
        myMessage.success(this.$i18n.t('m.Update_Successfully'));
      });
    },

    deleteProblem(id) {
      this.$confirm(this.$i18n.t('m.Delete_Problem_Tips'), 'Tips', {
        type: 'warning',
      }).then(
          () => {
            api
                .admin_deleteTrainingProblem(id, null)
                .then((res) => {
                  myMessage.success(this.$i18n.t('m.Delete_successfully'));
                  this.getProblemList(this.currentPage);
                })
                .catch(() => {
                });
          },
          () => {
          }
      );
    },
    removeProblem(pid) {
      this.$confirm(this.$i18n.t('m.Remove_Training_Problem_Tips'), 'Tips', {
        type: 'warning',
      }).then(
          () => {
            api
                .admin_deleteTrainingProblem(pid, this.trainingId)
                .then((res) => {
                  myMessage.success('success');
                  this.getProblemList(this.currentPage);
                })
                .catch(() => {
                });
          },
          () => {
          }
      );
    },
    downloadTestCase(problemID) {
      let url = '/api/file/download-testcase?pid=' + problemID;
      utils.downloadFile(url).then(() => {
        this.$alert(this.$i18n.t('m.Download_Testcase_Success'), 'Tips');
      });
    },
    filterByKeyword() {
      this.currentChange(1);
    },
    addRemoteOJProblem() {
      if (!this.otherOJProblemId) {
        myMessage.error(this.$i18n.t('m.Problem_ID_is_required'));
        return;
      }
      this.addRemoteOJproblemLoading = true;
      api
          .admin_addTrainingRemoteOJProblem(
              this.otherOJName,
              this.otherOJProblemId,
              this.trainingId
          )
          .then(
              (res) => {
                this.addRemoteOJproblemLoading = false;
                this.AddRemoteOJProblemDialogVisible = false;
                myMessage.success(this.$i18n.t('m.Add_Successfully'));
                this.currentChange(1);
              },
              (err) => {
                this.addRemoteOJproblemLoading = false;
              }
          );
    },
  },
  watch: {
    $route(newVal, oldVal) {
      if (
          newVal.params.trainingId != oldVal.params.trainingId ||
          newVal.name != oldVal.name
      ) {
        this.init();
      }
    },
  },
};
</script>

<style scoped>
.filter-row span button {
  margin-top: 5px;
  margin-bottom: 5px;
}

.filter-row span div {
  margin-top: 8px;
}

@media screen and (max-width: 768px) {
  .filter-row span {
    margin-right: 5px;
  }

  .filter-row span div {
    width: 80%;
  }
}

@media screen and (min-width: 768px) {
  .filter-row span {
    margin-right: 20px;
  }
}
</style>
