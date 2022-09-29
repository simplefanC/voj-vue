<template>
  <el-card shadow>
    <div slot="header">
      <el-row style="margin-bottom: 10px">
        <el-col :span="20">
          <el-input
              style="width: 300px"
              prefix-icon="el-icon-search"
              v-model="keyword"
              :placeholder="$t('m.Contest_Rank_Search_Placeholder')"
              @keyup.enter.native="getContestRankData(1)"
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <span style="float:right;font-size: 20px;margin-top: 8px;">
            <el-popover placement="left-start" trigger="hover">
              <i slot="reference" class="el-icon-s-tools"></i>
              <div id="switches">
                <p>
                  <span>{{ $t('m.Chart') }}</span>
                  <el-switch v-model="showChart"></el-switch>
                </p>
                <p>
                  <span>{{ $t('m.Table') }}</span>
                  <el-switch v-model="showTable"></el-switch>
                </p>
                <p>
                  <span>{{ $t('m.Star_User') }}</span>
                  <el-switch
                      v-model="showStarUser"
                      @change="getContestRankData(page)"
                  ></el-switch>
                </p>
                <p>
                  <span>{{ $t('m.Auto_Refresh') }}(10s)</span>
                  <el-switch
                      v-model="autoRefresh"
                      :disabled="refreshDisabled"
                      @change="handleAutoRefresh"
                  ></el-switch>
                </p>
                <template v-if="isContestAdmin">
                  <p>
                    <span>{{ $t('m.Force_Update') }}</span>
                    <el-switch
                        v-model="forceUpdate"
                        @change="getContestRankData(page)"
                    ></el-switch>
                  </p>
                  <el-button size="small" type="primary" @click="downloadRankCSV">{{
                      $t('m.Download_as_CSV')
                    }}</el-button>
                </template>
                <!--            <template>-->
                <!--              <el-button type="primary" size="small" @click="downloadRankCSV">{{-->
                <!--                  $t('m.Download_as_CSV')-->
                <!--                }}</el-button>-->
                <!--            </template>-->
              </div>
            </el-popover>
          </span>
        </el-col>
      </el-row>
      <!--      <span class="panel-title">{{ $t('m.Contest_Rank') }}</span>-->
    </div>
    <div v-show="showChart" class="echarts">
      <ECharts ref="chart" :autoresize="true" :options="options"></ECharts>
    </div>
    <div v-show="showTable">
      <vxe-table
          ref="ACMContestRank"
          :cell-class-name="cellClassName"
          :data="dataRank"
          align="center"
          auto-resize
          border
          round
          size="medium"
          @cell-click="getUserProblemSubmission"
      >
        <!--序号-->
        <vxe-table-column v-if="isContestAdmin" :title="$t('m.Order_Number')" field="seq" fixed="left" width="50">
          <template v-slot="{ row }">
            {{ row.seq }}
          </template>
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Contest_Rank_Seq')"
            field="rank"
            fixed="left"
            width="50"
        >
          <template v-slot="{ row }">
            {{ row.rank == -1 ? '*' : row.rank }}
          </template>
        </vxe-table-column>
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
                :title="row[contest.rankShowName]"
                :username="row[contest.rankShowName]"
                color="#FFF"
            ></avatar>
            <el-tooltip placement="top">
              <div slot="content">
                {{
                  row.isConcerned ? $t('m.Unfollow') : $t('m.Top_And_Follow')
                }}
              </div>
              <span
                  class="contest-rank-concerned"
                  @click="updateConcernedList(row.uid, !row.isConcerned)"
              >
                <i
                    v-if="row.isConcerned"
                    class="fa fa-star"
                    style="color: red;"
                ></i>
                <i v-else class="el-icon-star-off"></i>
              </span>
            </el-tooltip>
            <span style="float:right;text-align:right">
              <a @click="getUserHomeByUsername(row.uid, row.username)">
                <span class="contest-username">
                  <span v-if="row.uid == userInfo.uid" class="contest-rank-flag"
                  >Me</span
                  >
                  <span v-if="row.rank == -1" class="contest-rank-flag"
                  >Star</span
                  >
                  <span v-if="row.gender == 'female'" class="contest-rank-flag"
                  >Girl</span
                  >
                  {{ row[contest.rankShowName] }}</span
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
                :title="row[contest.rankShowName]"
                :username="row[contest.rankShowName]"
                color="#FFF"
            ></avatar>
            <el-tooltip placement="top">
              <div slot="content">
                {{
                  row.isConcerned ? $t('m.Unfollow') : $t('m.Top_And_Follow')
                }}
              </div>
              <span
                  class="contest-rank-concerned"
                  @click="updateConcernedList(row.uid, !row.isConcerned)"
              >
                <i
                    v-if="row.isConcerned"
                    class="fa fa-star"
                    style="color: red;"
                ></i>
                <i v-else class="el-icon-star-off"></i>
              </span>
            </el-tooltip>
            <span style="float:right;text-align:right">
              <a @click="getUserHomeByUsername(row.uid, row.username)">
                <span class="contest-username">
                  <span v-if="row.uid == userInfo.uid" class="contest-rank-flag"
                  >Me</span
                  >
                  <span v-if="row.rank == -1" class="contest-rank-flag"
                  >Star</span
                  >
                  <span v-if="row.gender == 'female'" class="contest-rank-flag"
                  >Girl</span
                  >
                  {{ row[contest.rankShowName] }}</span
                >
                <span v-if="row.school" class="contest-school">{{
                    row.school
                  }}</span>
              </a>
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column
            v-if="isContestAdmin"
            :title="$t('m.RealName')"
            field="realname"
            min-width="96"
            show-overflow
        >
        </vxe-table-column>
        <vxe-table-column :title="$t('m.AC')" field="rating" min-width="60">
          <template v-slot="{ row }">
            <span>
              <a
                  style="color:rgb(87, 163, 243);font-weight: 600;font-size: 14px;"
                  @click="getUserACSubmit(row.username)"
              >{{ row.ac }}
              </a>
            </span>
          </template>
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.TotalTime')"
            field="totalTime"
            min-width="60"
        >
          <template v-slot="{ row }">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">
                {{ parseTimeToSpecific(row.totalTime) }}
              </div>
              <span>{{ parseInt(row.totalTime / 60) }}</span>
            </el-tooltip>
          </template>
        </vxe-table-column>
        <vxe-table-column
            v-for="problem in contestProblems"
            :key="problem.displayId"
            :field="problem.displayId"
            min-width="74"
        >
          <template v-slot:header>
            <span v-if="problem.color" class="contest-rank-balloon">
              <svg
                  class="icon"
                  height="25"
                  p-id="5840"
                  t="1633685184463"
                  version="1.1"
                  viewBox="0 0 1088 1024"
                  width="25"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    :fill="problem.color"
                    d="M575.872 849.408c-104.576 0-117.632-26.56-119.232-31.808-6.528-22.528 32.896-70.592 63.744-96.768l-1.728-2.624c137.6-42.688 243.648-290.112 243.648-433.472A284.544 284.544 0 0 0 478.016 0a284.544 284.544 0 0 0-284.288 284.736c0 150.4 116.352 415.104 263.744 438.336-25.152 29.568-50.368 70.784-39.104 108.928 12.608 43.136 62.72 63.232 157.632 63.232 7.872 0 11.52 9.408 4.352 19.52-21.248 29.248-77.888 63.424-167.68 63.424V1024c138.944 0 215.936-74.816 215.936-126.528a46.72 46.72 0 0 0-16.32-36.608 56.32 56.32 0 0 0-36.416-11.456zM297.152 297.472c0 44.032-38.144 25.344-38.144-38.656 0-108.032 85.248-195.712 190.592-195.712 62.592 0 81.216 39.232 38.08 39.232-105.152 0.064-190.528 87.04-190.528 195.136z"
                    p-id="5841"
                ></path>
              </svg>
            </span>
            <span>
              <a
                  class="emphasis"
                  style="color:#495060;"
                  @click="getContestProblemById(problem.displayId)"
              >
                {{ problem.displayId }}
              </a>
            </span>
            <br/>
            <span>
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  {{ problem.displayId + '. ' + problem.displayTitle }}
                  <br/>
                  {{ 'Accepted: ' + problem.ac }}
                  <br/>
                  {{ 'Rejected: ' + (problem.total - problem.ac) }}
                </div>
                <span>({{ problem.ac }}/{{ problem.total }}) </span>
              </el-tooltip>
            </span>
          </template>
          <template v-slot="{ row }">
            <span
                v-if="row.submissionInfo[problem.displayId]"
                class="submission-hover"
            >
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  {{ row.submissionInfo[problem.displayId].specificTime }}
                </div>
                <span
                    v-if="row.submissionInfo[problem.displayId].isAC"
                    class="submission-time"
                >{{ row.submissionInfo[problem.displayId].ACTime }}<br/>
                </span>
              </el-tooltip>

              <span
                  v-if="
                  row.submissionInfo[problem.displayId].tryNum == null &&
                    row.submissionInfo[problem.displayId].errorNum != 0
                "
                  class="submission-error"
              >
                {{
                  row.submissionInfo[problem.displayId].errorNum > 1
                      ? row.submissionInfo[problem.displayId].errorNum + ' tries'
                      : row.submissionInfo[problem.displayId].errorNum + ' try'
                }}
              </span>
              <span v-if="row.submissionInfo[problem.displayId].tryNum != null"
              ><template
                  v-if="row.submissionInfo[problem.displayId].errorNum > 0"
              >
                  {{
                  row.submissionInfo[problem.displayId].errorNum
                }}+</template
              >{{
                  row.submissionInfo[problem.displayId].tryNum
                }}{{
                  row.submissionInfo[problem.displayId].errorNum +
                  row.submissionInfo[problem.displayId].tryNum >
                  1
                      ? ' tries'
                      : ' try'
                }}
              </span>
            </span>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
    <Pagination
        :current.sync="page"
        :layout="'prev, pager, next, sizes'"
        :page-size.sync="limit"
        :page-sizes="[10, 30, 50]"
        :total="total"
        @on-change="getContestRankData"
        @on-page-size-change="getContestRankData(1)"
    ></Pagination>
  </el-card>
</template>
<script>
import Avatar from 'vue-avatar';
import moment from 'moment';
import {mapActions} from 'vuex';
import time from '@/common/time';
import utils from '@/common/utils';
import ContestRankMixin from './contestRankMixin';

const Pagination = () => import('@/components/oj/common/Pagination');

export default {
  name: 'ACMContestRank',
  mixins: [ContestRankMixin],
  components: {
    Pagination,
    Avatar,
  },
  data() {
    return {
      total: 0,
      page: 1,
      limit: 50,
      keyword: '',
      autoRefresh: false,
      contestID: '',
      dataRank: [],
      options: {
        title: {
          text: this.$i18n.t('m.Top_10_Teams'),
          left: 'center',
          top: 0,
        },
        dataZoom: [
          {
            type: 'inside',
            filterMode: 'none',
            xAxisIndex: [0],
            start: 0,
            end: 100,
          },
        ],
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {show: true, title: this.$i18n.t('m.save_as_image')},
          },
          right: '0',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            axis: 'x',
          },
        },
        legend: {
          orient: 'horizontal',
          x: 'center',
          top: '8%',
          right: 0,
          data: [],
          formatter: (value) => {
            return utils.breakLongWords(value, 16);
          },
          textStyle: {
            fontSize: 12,
          },
        },
        grid: {
          x: 80,
          x2: 100,
          left: '5%', //设置canvas图距左的距离
          top: '25%',
          right: '5%',
          bottom: '10%',
        },
        xAxis: [
          {
            type: 'time',
            splitLine: false,
            axisPointer: {
              show: true,
              snap: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [0],
          },
        ],
        series: [],
      },
    };
  },
  created() {
    this.initConcernedList();
  },
  mounted() {
    this.contestID = this.$route.params.contestID;
    this.getContestRankData(1);
    this.addChartCategory(this.contestProblems);
    if (!this.refreshDisabled) {
      this.autoRefresh = true;
      this.handleAutoRefresh(true);
    }
  },
  methods: {
    ...mapActions(['getContestProblems']),
    getUserACSubmit(username) {
      this.$router.push({
        name: 'ContestSubmissionList',
        query: {username: username, status: 0},
      });
    },
    getUserHomeByUsername(uid, username) {
      this.$router.push({
        name: 'UserHome',
        query: {username: username, uid: uid},
      });
    },
    getContestProblemById(pid) {
      this.$router.push({
        name: 'ContestProblemDetails',
        params: {
          contestID: this.contestID,
          problemID: pid,
        },
      });
    },
    getUserProblemSubmission({row, column}) {
      if (
          column.property === 'seq' ||
          column.property === 'rank' ||
          column.property === 'rating' ||
          column.property === 'totalTime' ||
          column.property === 'username' ||
          column.property === 'realname'
      ) {
        return;
      }
      this.$router.push({
        name: 'ContestSubmissionList',
        query: {username: row.username, problemID: column.property},
      });
    },
    cellClassName({row, rowIndex, column, columnIndex}) {
      if (column.property === 'username' && row.registered === false) {
        return 'unregistered';
      }

      if (row.username === this.userInfo.username) {
        if (
            column.property === 'seq' ||
            column.property === 'rank' ||
            column.property === 'rating' ||
            column.property === 'totalTime' ||
            column.property === 'username' ||
            column.property === 'realname'
        ) {
          return 'own-submit-row';
        }
      }

      if (column.property === 'username' && row.userCellClassName) {
        return row.userCellClassName;
      }

      if (
          column.property !== 'seq' &&
          column.property !== 'rank' &&
          column.property !== 'rating' &&
          column.property !== 'totalTime' &&
          column.property !== 'username' &&
          column.property !== 'realname'
      ) {
        if (this.isContestAdmin) {
          return row.cellClassName[
              [this.contestProblems[columnIndex - 6].displayId]
              ];
        } else {
          return row.cellClassName[
              [this.contestProblems[columnIndex - 4].displayId]
              ];
        }
      } else {
        if (row.isConcerned && column.property !== 'username') {
          return 'bg-concerned';
        }
      }
    },
    applyToTable(dataRank) {
      dataRank.forEach((rank, i) => {
        let info = rank.submissionInfo;
        let cellClass = {};
        if (this.concernedList.indexOf(rank.uid) != -1) {
          dataRank[i].isConcerned = true;
        }
        Object.keys(info).forEach((problemID) => {
          dataRank[i][problemID] = info[problemID];
          if (dataRank[i][problemID].ACTime != null) {
            dataRank[i][problemID].errorNum += 1;
            dataRank[i][problemID].specificTime = this.parseTimeToSpecific(
                dataRank[i][problemID].ACTime
            );
            dataRank[i][problemID].ACTime = parseInt(
                dataRank[i][problemID].ACTime / 60
            );
          }
          let status = info[problemID];
          if (status.isFirstAC) {
            cellClass[problemID] = 'first-ac';
          } else if (status.isAC) {
            cellClass[problemID] = 'ac';
          } else if (status.tryNum != null && status.tryNum > 0) {
            cellClass[problemID] = 'try';
          } else if (status.errorNum != 0) {
            cellClass[problemID] = 'wa';
          }
        });
        dataRank[i].cellClassName = cellClass;
        if (dataRank[i].rank == -1) {
          dataRank[i].userCellClassName = 'bg-star';
        }
        if (dataRank[i].gender == 'female') {
          dataRank[i].userCellClassName = 'bg-female';
        }
      });
      this.dataRank = dataRank;
    },
    addChartCategory(contestProblems) {
      let category = [];
      for (let i = 0; i <= contestProblems.length; ++i) {
        category.push(i);
      }
      this.options.yAxis[0].data = category;
    },
    applyToChart(rankData) {
      let [users, seriesData] = [[], []];
      let len = rankData.length;
      let topIndex = this.concernedList.length || 0;
      if (rankData.length > 0) {
        if (rankData[0].uid == this.userInfo.uid) {
          topIndex++;
        }
      }
      for (let i = topIndex; i < len && i < topIndex + 10; i++) {
        let rank = rankData[i];
        users.push(rank[this.contest.rankShowName]);
        let info = rank.submissionInfo;
        // 提取出已AC题目的时间
        let timeData = [];
        Object.keys(info).forEach((problemID) => {
          if (info[problemID].isAC) {
            timeData.push(info[problemID].ACTime);
          }
        });
        timeData.sort((a, b) => {
          return a - b;
        });

        let data = [];
        data.push([this.contest.startTime, 0]);

        for (let [index, value] of timeData.entries()) {
          let realTime = moment(this.contest.startTime)
              .add(value, 'seconds')
              .format();
          data.push([realTime, index + 1]);
        }
        seriesData.push({
          name: rank[this.contest.rankShowName],
          type: 'line',
          data,
        });
      }
      this.options.legend.data = users;
      this.options.series = seriesData;
    },
    parseTimeToSpecific(totalTime) {
      return time.secondFormat(totalTime);
    },
    downloadRankCSV() {
      utils.downloadFile(
          `/api/file/download-contest-rank?cid=${
              this.$route.params.contestID
          }&forceRefresh=${this.forceUpdate ? true : false}`
      );
    },
  },
  watch: {
    contestProblems(newVal, OldVal) {
      if (newVal.length != 0) {
        this.addChartCategory(this.contestProblems);
      }
    },
  },
  computed: {
    contest() {
      return this.$store.state.contest.contest;
    },
    isMobileView() {
      return window.screen.width < 768;
    },
  },
};
</script>

<style scoped>
.echarts {
  margin: 20px auto;
  height: 400px;
  width: 100%;
}

/deep/ .el-card__body {
  padding: 20px !important;
  padding-top: 0px !important;
}

.screen-full {
  margin-right: 8px;
}

#switches p {
  margin-top: 5px;
}

#switches p:first-child {
  margin-top: 0;
}

#switches p span {
  margin-left: 8px;
  margin-right: 4px;
}

.vxe-cell p,
.vxe-cell span {
  margin: 0;
  padding: 0;
}

/deep/ .vxe-table .vxe-header--column:not(.col--ellipsis) {
  padding: 4px 0 !important;
}

/deep/ .vxe-table .vxe-body--column {
  line-height: 20px !important;
  padding: 0 !important;
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

/deep/ .vxe-body--column {
  min-width: 0;
  height: 48px;
  box-sizing: border-box;
  text-align: left;
  text-overflow: ellipsis;
  vertical-align: middle;
}

/deep/ .vxe-table .vxe-cell {
  padding-left: 5px !important;
  padding-right: 5px !important;
}

.submission-time {
  font-size: 15.6px;
  font-family: Roboto, sans-serif;
}

.submission-error {
  font-weight: 400;
}
</style>
