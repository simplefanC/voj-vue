<template>
  <div style="text-align:center">
    <vxe-input
        v-model="keyword"
        :placeholder="$t('m.Enter_keyword')"
        size="medium"
        style="margin-bottom:10px"
        type="search"
        @search-click="filterByKeyword"
        @keyup.enter.native="filterByKeyword"
    ></vxe-input>
    <vxe-table
        :data="problems"
        :loading="loading"
        align="center"
        auto-resize
        stripe
    >
      <vxe-table-column field="problemId" min-width="100" title="ID">
      </vxe-table-column>
      <vxe-table-column :title="$t('m.Title')" field="title" min-width="150">
      </vxe-table-column>
      <vxe-table-column :title="$t('m.Option')" align="center" min-width="100">
        <template v-slot="{ row }">
          <el-tooltip :content="$t('m.Add')" effect="dark" placement="top">
            <el-button
                icon="el-icon-plus"
                size="mini"
                type="primary"
                @click.native="handleAddProblem(row.id, row.problemId)"
            >
            </el-button>
          </el-tooltip>
        </template>
      </vxe-table-column>
    </vxe-table>

    <el-pagination
        :current-page.sync="page"
        :page-size="limit"
        :total="total"
        class="page"
        layout="prev, pager, next"
        @current-change="getPublicProblem"
    >
    </el-pagination>
  </div>
</template>
<script>
import api from '@/common/api';
import myMessage from '@/common/message';

export default {
  name: 'add-problem-from-public',
  props: ['contestID', 'trainingID'],
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      loading: false,
      problems: [],
      contest: {},
      keyword: '',
    };
  },
  mounted() {
    if (this.contestID) {
      api
          .admin_getContest(this.contestID)
          .then((res) => {
            this.contest = res.data.data;
            // this.$emit('getTips', this.contest.type == 0
            //     ? this.$i18n.t('m.ACM_Contest_Add_From_Public_Problem_Tips')
            //     : this.$i18n.t('m.OI_Contest_Add_From_Public_Problem_Tips')
            // );
            this.getPublicProblem(1);
          })
          .catch(() => {
          });
    } else if (this.trainingID) {
      this.getPublicProblem(1);
    }
  },
  methods: {
    getPublicProblem(page) {
      this.loading = true;
      let params = {
        keyword: this.keyword,
        currentPage: page,
        limit: this.limit,
        problemType: this.contest.type,
        cid: this.contest.id,
        tid: this.trainingID,
      };

      let func = null;
      if (this.contestID) {
        func = 'admin_getContestProblemList';
      } else if (this.trainingID) {
        func = 'admin_getTrainingProblemList';
      }

      api[func](params)
          .then((res) => {
            this.loading = false;
            this.total = res.data.data.problemList.total;
            this.problems = res.data.data.problemList.records;
          })
          .catch(() => {
            this.loading = false;
          });
    },
    handleAddProblem(id, problemId) {
      if (this.contestID) {
        // this.$prompt(
        //     this.$i18n.t('m.Enter_The_Problem_Display_ID_in_the_Contest'), 'Tips'
        //     // , {
        //     //   inputPattern: /\d+/,
        //     //   inputErrorMessage: this.$i18n.t('m.The_Problem_Display_ID_in_the_Contest_format_error')
        //     // }
        // ).then(
        //     ({value}) => {
        //
        //     },
        //     () => {
        //     }
        // );
        let data = {
          pid: id,
          cid: this.contestID
        };
        api.admin_addContestProblemFromPublic(data).then(
            (res) => {
              this.$emit('on-change');
              myMessage.success(this.$i18n.t('m.Add_Successfully'));
              this.getPublicProblem(this.page);
            },
            () => {
            }
        );
      } else {
        let data = {
          pid: id,
          tid: this.trainingID,
          displayId: problemId,
        };
        api.admin_addTrainingProblemFromPublic(data).then(
            (res) => {
              this.$emit('on-change');
              myMessage.success(this.$i18n.t('m.Add_Successfully'));
              this.getPublicProblem(this.page);
            },
            () => {
            }
        );
      }
    },
    filterByKeyword() {
      this.getPublicProblem(this.page);
    },
  },
};
</script>
<style scoped>
.page {
  margin-top: 20px;
  text-align: right;
}
</style>
