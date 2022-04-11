<template>
  <div>
    <el-card>
      <div slot="header">
        <span class="panel-title home-title">{{ $t('m.Training_List') }}</span>
        <div class="filter-row">
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
          <span>
            <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="goCreateTraining"
            >{{ $t('m.Create') }}
            </el-button>
          </span>
        </div>
      </div>
      <vxe-table
          ref="xTable"
          :data="trainingList"
          :loading="loading"
          align="center"
          auto-resize
          stripe
      >
        <vxe-table-column field="id" title="ID" width="80"></vxe-table-column>
        <vxe-table-column :title="$t('m.Order_Number')" field="rank" width="80">
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Title')"
            field="title"
            min-width="150"
            show-overflow
        >
        </vxe-table-column>
        <vxe-table-column :title="$t('m.Auth')" width="100">
          <template v-slot="{ row }">
            <el-tag :type="TRAINING_TYPE[row.auth]['color']" effect="dark">
              {{ row.auth }}
            </el-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column :title="$t('m.Visible')" min-width="80">
          <template v-slot="{ row }">
            <el-switch
                v-model="row.status"
                :disabled="!isSuperAdmin && userInfo.username != row.author"
                @change="changeTrainingStatus(row.id, row.status, row.author)"
            >
            </el-switch>
          </template>
        </vxe-table-column>
        <vxe-table-column :title="$t('m.Info')" min-width="210">
          <template v-slot="{ row }">
            <p>Created Time: {{ row.gmtCreate | localtime }}</p>
            <p>Update Time: {{ row.gmtModified | localtime }}</p>
            <p>Creator: {{ row.author }}</p>
          </template>
        </vxe-table-column>
        <vxe-table-column :title="$t('m.Option')" min-width="150">
          <template v-slot="{ row }">
            <template v-if="isSuperAdmin || userInfo.username == row.author">
              <div style="margin-bottom:10px">
                <el-tooltip
                    :content="$t('m.Edit')"
                    effect="dark"
                    placement="top"
                >
                  <el-button
                      icon="el-icon-edit"
                      size="mini"
                      type="primary"
                      @click.native="goEdit(row.id)"
                  >
                  </el-button>
                </el-tooltip>
                <el-tooltip
                    :content="$t('m.View_Training_Problem_List')"
                    effect="dark"
                    placement="top"
                >
                  <el-button
                      icon="el-icon-tickets"
                      size="mini"
                      type="success"
                      @click.native="goTrainingProblemList(row.id)"
                  >
                  </el-button>
                </el-tooltip>
              </div>
            </template>
            <el-tooltip
                v-if="isSuperAdmin"
                :content="$t('m.Delete')"
                effect="dark"
                placement="top"
            >
              <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click.native="deleteTraining(row.id)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </vxe-table-column>
      </vxe-table>
      <div class="panel-options">
        <el-pagination
            :page-size="pageSize"
            :total="total"
            class="page"
            layout="prev, pager, next"
            @current-change="currentChange"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import api from '@/common/api';
import {TRAINING_TYPE} from '@/common/constants';
import {mapGetters} from 'vuex';
import myMessage from '@/common/message';

export default {
  name: 'TrainingList',
  data() {
    return {
      pageSize: 10,
      total: 0,
      trainingList: [],
      keyword: '',
      loading: false,
      excludeAdmin: true,
      currentPage: 1,
      currentId: 1,
      downloadDialogVisible: false,
      TRAINING_TYPE: {},
    };
  },
  mounted() {
    this.getTrainingList(this.currentPage);
    this.TRAINING_TYPE = Object.assign({}, TRAINING_TYPE);
  },
  watch: {
    $route() {
      let refresh = this.$route.query.refresh == 'true' ? true : false;
      if (refresh) {
        this.getTrainingList(1);
      }
    },
  },
  computed: {
    ...mapGetters(['isSuperAdmin', 'userInfo']),
  },
  methods: {
    // 切换页码回调
    currentChange(page) {
      this.currentPage = page;
      this.getTrainingList(page);
    },
    getTrainingList(page) {
      this.loading = true;
      api.admin_getTrainingList(page, this.pageSize, this.keyword).then(
          (res) => {
            this.loading = false;
            this.total = res.data.data.total;
            this.trainingList = res.data.data.records;
          },
          (res) => {
            this.loading = false;
          }
      );
    },
    goEdit(trainingId) {
      this.$router.push({
        name: 'admin-edit-training',
        params: {trainingId},
      });
    },
    goTrainingProblemList(trainingId) {
      this.$router.push({
        name: 'admin-training-problem-list',
        params: {trainingId},
      });
    },
    deleteTraining(trainingId) {
      this.$confirm(this.$i18n.t('m.Delete_Training_Tips'), 'Tips', {
        confirmButtonText: this.$i18n.t('m.OK'),
        cancelButtonText: this.$i18n.t('m.Cancel'),
        type: 'warning',
      }).then(() => {
        api.admin_deleteTraining(trainingId).then((res) => {
          myMessage.success(this.$i18n.t('m.Delete_successfully'));
          this.currentChange(1);
        });
      });
    },
    changeTrainingStatus(trainingId, status, author) {
      api.admin_changeTrainingStatus(trainingId, status, author).then((res) => {
        myMessage.success(this.$i18n.t('m.Update_Successfully'));
      });
    },
    filterByKeyword() {
      this.currentChange(1);
    },
    goCreateTraining() {
      this.$router.push({name: 'admin-create-training'});
    },
  },
};
</script>
<style scoped>
.filter-row {
  margin-top: 10px;
}

@media screen and (max-width: 768px) {
  .filter-row span {
    margin-right: 5px;
  }

  .filter-row span div {
    width: 80% !important;
  }
}

@media screen and (min-width: 768px) {
  .filter-row span {
    margin-right: 20px;
  }
}

.el-tag--dark {
  border-color: #fff;
}
</style>
