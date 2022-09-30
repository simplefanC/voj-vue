<template>
  <div class="scoreboard-body">
    <el-card v-loading="loading.info" shadow>
      <div class="contest-title">
        <div slot="header">
          <span class="panel-title">{{ contest.title }}</span>
        </div>
      </div>
      <el-row style="margin-top: 10px;">
        <el-col :span="12" class="text-align:left">
          <el-tooltip
              v-if="contest.auth != null && contest.auth != undefined"
              :content="$t('m.' + CONTEST_TYPE_REVERSE[contest.auth]['tips'])"
              placement="top"
          >
            <el-tag
                :type.sync="CONTEST_TYPE_REVERSE[contest.auth]['color']"
                effect="plain"
            >
              {{ $t('m.' + CONTEST_TYPE_REVERSE[contest.auth]['name']) }}
            </el-tag>
          </el-tooltip>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button v-if="contest.count != null" plain size="small">
            <i class="el-icon-user-solid" style="color:rgb(48, 145, 242);"></i
            >x{{ contest.count }}
          </el-button>
          <el-button
              v-if="contest != null"
              :type="contest.type == 0 ? 'primary' : 'warning'"
              size="small"
          >
            <i class="fa fa-trophy"></i>
            {{ contest.type | parseContestType }}
          </el-button>
        </el-col>
      </el-row>
      <div class="contest-time">
        <el-row>
          <el-col :md="12" :xs="24" class="left">
            <p>
              <i aria-hidden="true" class="fa fa-hourglass-start"></i>
              {{ $t('m.StartAt') }}：{{ contest.startTime | localtime }}
            </p>
          </el-col>
          <el-col :md="12" :xs="24" class="right">
            <p>
              <i aria-hidden="true" class="fa fa-hourglass-end"></i>
              {{ $t('m.EndAt') }}：{{ contest.endTime | localtime }}
            </p>
          </el-col>
        </el-row>
      </div>
      <div class="slider">
        <el-slider
            v-model="progressValue"
            :format-tooltip="formatTooltip"
            :step="timeStep"
        ></el-slider>
      </div>
      <el-row>
        <el-col :span="24" style="text-align:center">
          <el-tag :style="countdownColor" effect="dark" size="medium">
            <i aria-hidden="true" class="fa fa-circle"></i>
            {{ countdown }}
          </el-tag>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-loading="loading.rank" shadow style="margin-top:15px;">
      <el-row style="margin-bottom: 10px">
        <el-col :span="16">
          <el-input
              style="width: 300px"
              prefix-icon="el-icon-search"
              v-model="keyword"
              :placeholder="$t('m.Contest_Rank_Search_Placeholder')"
              @keyup.enter.native="getContestOutsideScoreboard(1)"
          >
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="contest-rank-switch">
            <span style="float:right;">
              <span>{{ $t('m.Auto_Refresh') }}(30s)</span>
              <el-switch
                  v-model="autoRefresh"
                  :disabled="contestEnded"
                  @change="handleAutoRefresh"
              ></el-switch>
            </span>
            <span v-if="isContestAdmin" style="float:right;">
              <span>{{ $t('m.Force_Update') }}</span>
              <el-switch
                  v-model="forceUpdate"
                  @change="getContestOutsideScoreboard(page)"
              ></el-switch>
            </span>
            <span style="float:right;">
              <span>{{ $t('m.Star_User') }}</span>
              <el-switch
                  v-model="showStarUser"
                  @change="getContestOutsideScoreboard(page)"
              ></el-switch>
            </span>
          </div>
        </el-col>
      </el-row>

      <vxe-table
          :cell-class-name="cellClassName"
          :data="dataRank"
          align="center"
          auto-resize
          border
          round
          size="medium"
      >
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
                <span class="contest-username"
                ><span v-if="row.rank == -1" class="contest-rank-flag"
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
                <span class="contest-username"
                ><span v-if="row.rank == -1" class="contest-rank-flag"
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
        <vxe-table-column :title="$t('m.AC')" field="rating" min-width="60">
          <template v-slot="{ row }">
            <span
                style="color:rgb(87, 163, 243);font-weight: 600;font-size: 14px;"
            >{{ row.ac }}
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
              <a class="emphasis" style="color:#495060;">
                {{ problem.displayId }}
              </a>
            </span>
            <br/>
            <span>
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  {{ problem.displayId + '. ' + problem.displayTitle }}
                  <br/>
                  {{
                    'Accepted: ' +
                    getProblemCount(problemACCountMap[problem.displayId])
                  }}
                  <br/>
                  {{
                    'Rejected: ' +
                    getProblemCount(problemErrorCountMap[problem.displayId])
                  }}
                </div>
                <span
                >({{
                    getProblemCount(problemACCountMap[problem.displayId])
                  }}/{{
                    getProblemCount(problemACCountMap[problem.displayId]) +
                    getProblemCount(problemErrorCountMap[problem.displayId])
                  }})
                </span>
              </el-tooltip>
            </span>
          </template>
          <template v-slot="{ row }">
            <span v-if="row.submissionInfo[problem.displayId]">
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
      <Pagination
          :current.sync="page"
          :layout="'prev, pager, next, sizes'"
          :page-size.sync="limit"
          :page-sizes="[10, 30, 50]"
          :total="total"
          @on-change="getContestOutsideScoreboard"
          @on-page-size-change="getContestOutsideScoreboard(1)"
      ></Pagination>
    </el-card>
  </div>
</template>
<script>
import Avatar from 'vue-avatar';
import time from '@/common/time';
import ScoreBoardMixin from './scoreBoardMixin';

const Pagination = () => import('@/components/oj/common/Pagination');

export default {
  name: 'ACMScoreBoard',
  mixins: [ScoreBoardMixin],
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
      removeStar: false,
      loading: {
        info: false,
        rank: false,
      },
      contestID: '',
      dataRank: [],
      timer: null,
      CONTEST_STATUS: {},
      CONTEST_STATUS_REVERSE: {},
      CONTEST_TYPE_REVERSE: {},
      RULE_TYPE: {},
      problemACCountMap: {},
      problemErrorCountMap: {},
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.getContestOutsideScoreboard(1);
  },
  methods: {
    getUserHomeByUsername(uid, username) {
      this.$router.push({
        name: 'UserHome',
        query: {username: username, uid: uid},
      });
    },
    cellClassName({row, rowIndex, column, columnIndex}) {
      if (column.property === 'username' && row.userCellClassName) {
        return row.userCellClassName;
      }
      if (
          column.property !== 'rank' &&
          column.property !== 'rating' &&
          column.property !== 'totalTime' &&
          column.property !== 'username'
      ) {
        return row.cellClassName[
            [this.contestProblems[columnIndex - 4].displayId]
            ];
      } else {
        if (row.isConcerned && column.property !== 'username') {
          return 'bg-concerned';
        }
      }
    },
    applyToTable(dataRank) {
      let acCountMap = {};
      let errorCountMap = {};
      dataRank.forEach((rank, i) => {
        let info = rank.submissionInfo;
        let cellClass = {};
        if (this.concernedList.indexOf(rank.uid) != -1) {
          dataRank[i].isConcerned = true;
        }
        Object.keys(info).forEach((problemID) => {
          dataRank[i][problemID] = info[problemID];

          if (!acCountMap[problemID]) {
            acCountMap[problemID] = 0;
          }
          if (!errorCountMap[problemID]) {
            errorCountMap[problemID] = 0;
          }

          errorCountMap[problemID] += info[problemID].errorNum;

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
            acCountMap[problemID] += 1;
          } else if (status.isAC) {
            cellClass[problemID] = 'ac';
            acCountMap[problemID] += 1;
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
      this.problemACCountMap = acCountMap;
      this.problemErrorCountMap = errorCountMap;
    },
    parseTimeToSpecific(totalTime) {
      return time.secondFormat(totalTime);
    },
  },
  computed: {
    isMobileView() {
      return window.screen.width < 768;
    },
  },
};
</script>
<style scoped>
@media screen and (min-width: 1050px) {
  .scoreboard-body {
    margin-left: -2%;
    margin-right: -2%;
  }
}

.contest-title {
  text-align: center;
}

.panel-title {
  font-size: 1.5rem !important;
  font-weight: 500;
}

.contest-time {
  width: 100%;
  font-size: 16px;
}

@media screen and (min-width: 768px) {
  .contest-time .left {
    text-align: left;
  }

  .contest-time .right {
    text-align: right;
  }
}

@media screen and (max-width: 768px) {
  .contest-time .left,
  .contest-time .right {
    text-align: center;
  }
}

/deep/ .el-slider__button {
  width: 20px !important;
  height: 20px !important;
  background-color: #409eff !important;
}

/deep/ .el-slider__button-wrapper {
  z-index: 500;
}

/deep/ .el-slider__bar {
  height: 10px !important;
  background-color: #09be24 !important;
}

.el-tag--dark {
  border-color: #fff;
}

.el-tag {
  color: rgb(25, 190, 107);
  background: #fff;
  border: 1px solid #e9eaec;
  font-size: 18px;
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

/deep/ .el-card__body {
  padding: 15px !important;
  padding-top: 20px !important;
}

.vxe-cell p,
.vxe-cell span {
  margin: 0;
  padding: 0;
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

<style>
.contest-rank-switch {
  /*margin-bottom: 30px;*/
  margin-top: 10px;
}

.contest-rank-switch span {
  margin-left: 5px;
}

.contest-rank-concerned {
  font-size: 1rem;
  margin-left: 0.5rem !important;
  vertical-align: top;
}

.contest-rank-concerned i {
  margin-top: 11px;
  cursor: pointer;
}
</style>
