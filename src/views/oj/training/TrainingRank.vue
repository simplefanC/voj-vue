<template>
  <div style="margin-top:5px">
    <el-card shadow>
      <div slot="header" class="rank-title">
        <span class="panel-title">{{ $t('m.Record_List') }}</span>
      </div>
      <vxe-table
          ref="TraningtRank"
          :cell-class-name="cellClassName"
          :data="dataRank"
          :seq-config="{ startIndex: (this.page - 1) * this.limit }"
          align="center"
          auto-resize
          border
          round
          size="medium"
          @cell-click="getUserProblemSubmission"
      >
        <vxe-table-column
            field="rank"
            fixed="left"
            type="seq"
            width="50"
        ></vxe-table-column>
        <vxe-table-column
            v-if="!isMobileView"
            :title="$t('m.User')"
            align="left"
            field="username"
            fixed="left"
            header-align="center"
            min-width="300"
        >
          <template v-slot="{ row }">
            <avatar
                :inline="true"
                :size="37"
                :src="row.avatar"
                :title="row.username"
                :username="row.username"
                color="#FFF"
            ></avatar>

            <span style="float:right;text-align:right">
              <a @click="getUserHomeByUsername(row.uid, row.username)">
                <span class="contest-username"
                ><span v-if="row.gender == 'female'" class="contest-rank-flag"
                >Girl</span
                >{{ row.username }}</span
                >
                <span v-if="row.school" class="contest-school">{{
                    row.school
                  }}</span>
              </a>
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column
            v-else
            :title="$t('m.User')"
            align="left"
            field="username"
            header-align="center"
            min-width="300"
        >
          <template v-slot="{ row }">
            <avatar
                :inline="true"
                :size="37"
                :src="row.avatar"
                :title="row.username"
                :username="row.username"
                color="#FFF"
            ></avatar>

            <span style="float:right;text-align:right">
              <a @click="getUserHomeByUsername(row.uid, row.username)">
                <span class="contest-username"
                ><span v-if="row.gender == 'female'" class="contest-rank-flag"
                >Girl</span
                >{{ row.username }}</span
                >
                <span v-if="row.school" class="contest-school">{{
                    row.school
                  }}</span>
              </a>
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column
            v-if="isTrainingAdmin"
            :title="$t('m.RealName')"
            field="realname"
            min-width="96"
            show-overflow
        >
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Total_AC')"
            field="rating"
            min-width="90"
        >
          <template v-slot="{ row }">
            <span
            ><a
                style="color:rgb(87, 163, 243);font-size:16px"
                @click="getUserACSubmit(row.username)"
            >{{ row.ac }}</a
            >
              <br/>
              <span class="judge-time">({{ row.totalRunTime }}ms)</span>
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column
            v-for="(problem, index) in trainingProblemList"
            :key="index"
            :field="problem.problemId"
            min-width="70"
        >
          <template v-slot:header>
            <span
            ><a
                class="emphasis"
                style="color:#495060;"
                @click="getTrainingProblemById(problem.problemId)"
            >{{ problem.problemId }}</a
            ></span
            >
          </template>
          <template v-slot="{ row }">
            <template v-if="row.submissionInfo[problem.problemId]">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  {{
                    JUDGE_STATUS[row.submissionInfo[problem.problemId].status]
                        .name
                  }}
                </div>
                <span
                    :style="
                    'color:' +
                      JUDGE_STATUS[row.submissionInfo[problem.problemId].status]
                        .rgb
                  "
                    class="judge-status submission-hover"
                >
                  {{
                    JUDGE_STATUS[row.submissionInfo[problem.problemId].status]
                        .short
                  }}
                </span>
              </el-tooltip>
              <br/>
              <span class="judge-time">
                ({{
                  row.submissionInfo[problem.problemId].runTime
                      ? row.submissionInfo[problem.problemId].runTime
                      : 0
                }}ms)
              </span>
            </template>
          </template>
        </vxe-table-column>
      </vxe-table>
      <Pagination
          :current.sync="page"
          :layout="'prev, pager, next, sizes'"
          :page-size.sync="limit"
          :total="total"
          @on-change="getTrainingRankData"
          @on-page-size-change="getTrainingRankData(1)"
      ></Pagination>
    </el-card>
  </div>
</template>
<script>
import Avatar from 'vue-avatar';
import {mapActions, mapGetters, mapState} from 'vuex';
import {JUDGE_STATUS} from '@/common/constants';
import api from '@/common/api';
import time from '@/common/time';

const Pagination = () => import('@/components/oj/common/Pagination');

export default {
  name: 'TrainingRank',
  components: {
    Pagination,
    Avatar,
  },
  data() {
    return {
      total: 0,
      page: 1,
      limit: 30,
      trainingID: '',
      dataRank: [],
      JUDGE_STATUS: {},
    };
  },
  mounted() {
    this.JUDGE_STATUS = Object.assign({}, JUDGE_STATUS);
    if (!this.trainingProblemList.length) {
      this.getTrainingProblemList();
    }
    this.trainingID = this.$route.params.trainingID;
    this.getTrainingRankData();
  },
  methods: {
    ...mapActions(['getTrainingProblemList']),

    getTrainingRankData() {
      let data = {
        tid: this.trainingID,
        limit: this.limit,
        currentPage: this.page,
      };
      api.getTrainingRank(data).then(
          (res) => {
            this.total = res.data.data.total;
            this.applyToTable(res.data.data.records);
          },
          (err) => {
          }
      );
    },

    getUserACSubmit(username) {
      this.$router.push({
        name: 'SubmissionList',
        query: {username: username, status: 0},
      });
    },
    getUserHomeByUsername(uid, username) {
      this.$router.push({
        name: 'UserHome',
        query: {username: username, uid: uid},
      });
    },
    getTrainingProblemById(pid) {
      this.$router.push({
        name: 'TrainingProblemDetails',
        params: {
          trainingID: this.trainingID,
          problemID: pid,
        },
      });
    },
    getUserProblemSubmission({row, column}) {
      if (
          column.property !== 'rank' &&
          column.property !== 'totalScore' &&
          column.property !== 'username' &&
          column.property !== 'realname' &&
          column.property !== 'rating'
      ) {
        this.$router.push({
          name: 'SubmissionList',
          query: {username: row.username, problemID: column.property},
        });
      }
    },
    cellClassName({row, rowIndex, column, columnIndex}) {
      if (column.property === 'username' && row.userCellClassName) {
        return row.userCellClassName;
      }
    },
    applyToTable(dataRank) {
      dataRank.forEach((rank, i) => {
        if (dataRank[i].gender == 'female') {
          dataRank[i].userCellClassName = 'bg-female';
        }
      });
      this.dataRank = dataRank;
    },
    parseTotalTime(totalTime) {
      return time.secondFormat(totalTime);
    },
  },
  computed: {
    ...mapState({
      trainingProblemList: (state) => state.training.trainingProblemList,
    }),
    ...mapGetters(['isTrainingAdmin']),
    training() {
      return this.$store.state.training.training;
    },
    isMobileView() {
      return window.screen.width < 768;
    },
  },
};
</script>
<style scoped>
.rank-title {
  text-align: center;
}

/deep/ .el-card__body {
  padding: 20px !important;
}

.vxe-cell p,
.vxe-cell span {
  margin: 0;
  padding: 0;
}

@media screen and (max-width: 768px) {
  /deep/ .el-card__body {
    padding: 0 !important;
  }
}

a.emphasis {
  color: #495060 !important;
}

a.emphasis:hover {
  color: #2d8cf0 !important;
}

/deep/ .vxe-table .vxe-header--column:not(.col--ellipsis) {
  padding: 4px 0 !important;
}

/deep/ .vxe-table .vxe-body--column {
  padding: 4px 0 !important;
  line-height: 20px !important;
}

/deep/ .vxe-table .vxe-body--column:not(.col--ellipsis) {
  line-height: 20px !important;
  padding: 0 !important;
}

/deep/ .vxe-body--column {
  min-width: 0;
  height: 51px !important;
  box-sizing: border-box;
  text-align: left;
  text-overflow: ellipsis;
  vertical-align: middle;
}

/deep/ .vxe-table .vxe-cell {
  padding-left: 5px !important;
  padding-right: 5px !important;
}

.judge-status {
  font-size: 16px;
  font-weight: bold;
}

.judge-time {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}
</style>
