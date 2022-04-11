<template>
  <el-card shadow="always">
    <div slot="header">
      <span class="panel-title">{{ $t('m.Admin_Print') }}</span>
      <div class="filter-row">
        <span>
          {{ $t('m.Auto_Refresh') }}(10s)
          <el-switch
              v-model="autoRefresh"
              @change="handleAutoRefresh"
          ></el-switch>
        </span>
        <span>
          <el-button
              :loading="btnLoading"
              icon="el-icon-refresh"
              size="small"
              type="primary"
              @click="getContestPrint(1)"
          >{{ $t('m.Refresh') }}</el-button
          >
        </span>
      </div>
    </div>

    <vxe-table
        :data="printList"
        align="center"
        auto-resize
        border="inner"
        stripe
    >
      <vxe-table-column
          :title="$t('m.Username')"
          field="username"
          min-width="150"
      >
        <template v-slot="{ row }">
          <span
          ><a
              style="color:rgb(87, 163, 243);"
              @click="getUserTotalSubmit(row.username)"
          >{{ row.username }}</a
          >
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column
          :title="$t('m.RealName')"
          field="realname"
          min-width="150"
      ></vxe-table-column>
      <vxe-table-column
          :title="$t('m.Submit_Time')"
          field="gmtCreate"
          min-width="150"
      >
        <template v-slot="{ row }">
          <span>{{ row.gmtCreate | localtime }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column :title="$t('m.Status')" field="status" min-width="150">
        <template v-slot="{ row }">
          <el-tag v-if="row.status == 1" color="#19be6b" effect="dark">{{
              $t('m.Printed')
            }}
          </el-tag>
          <el-tag v-if="row.status == 0" color="#f90" effect="dark">{{
              $t('m.Not_Printed')
            }}
          </el-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column :title="$t('m.Option')" field="option" min-width="150">
        <template v-slot="{ row }">
          <el-button
              icon="el-icon-download"
              round
              size="small"
              type="primary"
              @click="downloadSubmissions(row.id)"
          >{{ $t('m.Download') }}
          </el-button
          >
          <el-button
              icon="el-icon-circle-check"
              round
              size="small"
              type="success"
              @click="updateStatus(row.id)"
          >{{ $t('m.OK') }}
          </el-button
          >
        </template>
      </vxe-table-column>
    </vxe-table>
    <Pagination
        :current.sync="page"
        :page-size.sync="limit"
        :total="total"
        @on-change="getContestPrint"
    ></Pagination>
  </el-card>
</template>

<script>
import api from '@/common/api';
import myMessage from '@/common/message';
import utils from '@/common/utils';

const Pagination = () => import('@/components/oj/common/Pagination');

export default {
  name: 'Contest-Print-Admin',
  components: {
    Pagination,
  },
  data() {
    return {
      page: 1,
      limit: 15,
      total: 0,
      btnLoading: false,
      autoRefresh: false,
      contestID: null,
      printList: [],
    };
  },
  mounted() {
    this.contestID = this.$route.params.contestID;
    this.getContestPrint(1);
  },
  methods: {
    updateStatus(id) {
      let params = {
        id: id,
        cid: this.contestID,
      };
      api.updateContestPrintStatus(params).then((res) => {
        myMessage.success(this.$i18n.t('m.Update_Successfully'));
        this.getContestPrint(1);
      });
    },
    getContestPrint(page = 1) {
      let params = {
        cid: this.contestID,
        currentPage: page,
        limit: this.limit,
      };
      this.btnLoading = true;
      api
          .getContestPrintList(params)
          .then((res) => {
            this.btnLoading = false;
            this.printList = res.data.data.records;
            this.total = res.data.data.total;
          })
          .catch(() => {
            this.btnLoading = false;
          });
    },
    downloadSubmissions(id) {
      let url = `/api/file/download-contest-print-text?id=${id}`;
      utils.downloadFile(url);
    },
    handleAutoRefresh() {
      if (this.autoRefresh) {
        this.refreshFunc = setInterval(() => {
          this.page = 1;
          this.getContestPrint(1);
        }, 10000);
      } else {
        clearInterval(this.refreshFunc);
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.refreshFunc);
  },
};
</script>

<style scoped>
.filter-row {
  float: right;
}

@media screen and (max-width: 768px) {
  .filter-row span {
    margin-right: 2px;
  }
}

@media screen and (min-width: 768px) {
  .filter-row span {
    margin-right: 20px;
  }
}

/deep/ .el-tag--dark {
  border-color: #fff;
}
</style>
