<template>
  <div class="problem-list">
    <!-- 判断是否需要密码验证 -->
    <!--    <el-card v-if="passwordFormVisible" class="password-form-card" style="text-align:center;margin-bottom:15px">-->
    <!--      <div slot="header">-->
    <!--              <span class="panel-title" style="color: #e6a23c;"-->
    <!--              ><i class="el-icon-warning">-->
    <!--                  {{ $t('m.Password_Required') }}</i-->
    <!--              ></span-->
    <!--              >-->
    <!--      </div>-->
    <!--      <p class="password-form-tips">-->
    <!--        {{ $t('m.To_Enter_Need_Password') }}-->
    <!--      </p>-->
    <!--      <el-form>-->
    <!--        <el-input-->
    <!--            v-model="contestPassword"-->
    <!--            :placeholder="$t('m.Enter_the_contest_password')"-->
    <!--            style="width:70%"-->
    <!--            type="password"-->
    <!--            @keydown.enter.native="checkPassword"-->
    <!--        />-->
    <!--        <el-button-->
    <!--            style="float:right;"-->
    <!--            type="primary"-->
    <!--            @click="checkPassword"-->
    <!--        >{{ $t('m.Enter') }}-->
    <!--        </el-button-->
    <!--        >-->
    <!--      </el-form>-->
    <!--    </el-card>-->
    <vxe-table
        :data="problems"
        align="center"
        auto-resize
        border="inner"
        highlight-hover-row
        stripe
        @cell-click="goContestProblem"
    >
      <!-- OI赛制的最近提交显示 -->
      <vxe-table-column
          v-if="isAuthenticated && contestRuleType == RULE_TYPE.OI"
          field="status"
          title=""
          width="50"
      >
        <template v-slot="{ row }">
          <template v-if="isGetStatusOk">
            <span v-if="row.score != null" :class="getScoreColor(row.score)">{{
                row.score
              }}</span>
            <el-tooltip
                v-else-if="row.myStatus == -5"
                :content="JUDGE_STATUS[row.myStatus]['name']"
                placement="top"
            >
              <i :style="getIconColor(row.myStatus)" class="fa fa-question"></i>
            </el-tooltip>
            <el-tooltip
                v-else
                :content="JUDGE_STATUS[row.myStatus]['name']"
                placement="top"
            >
              <i
                  v-if="row.myStatus != -10"
                  :style="getIconColor(row.myStatus)"
                  class="el-icon-minus"
              ></i>
            </el-tooltip>
          </template>
        </template>
      </vxe-table-column>

      <!-- ACM赛制的最近提交显示 -->
      <vxe-table-column
          v-if="isAuthenticated && contestRuleType == RULE_TYPE.ACM"
          field="status"
          title=""
          width="50"
      >
        <template v-slot="{ row }">
          <template v-if="isGetStatusOk">
            <el-tooltip
                :content="JUDGE_STATUS[row.myStatus]['name']"
                placement="top"
            >
              <i
                  v-if="row.myStatus == 0"
                  :style="getIconColor(row.myStatus)"
                  class="el-icon-check"
              ></i>
              <i
                  v-else-if="row.myStatus != -10"
                  :style="getIconColor(row.myStatus)"
                  class="el-icon-minus"
              ></i>
            </el-tooltip>
          </template>
        </template>
      </vxe-table-column>
      <vxe-table-column field="displayId" title="#" width="80">
        <template v-slot="{ row }">
          <span v-if="row.color" style="vertical-align: top;">
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
                  :fill="row.color"
                  d="M575.872 849.408c-104.576 0-117.632-26.56-119.232-31.808-6.528-22.528 32.896-70.592 63.744-96.768l-1.728-2.624c137.6-42.688 243.648-290.112 243.648-433.472A284.544 284.544 0 0 0 478.016 0a284.544 284.544 0 0 0-284.288 284.736c0 150.4 116.352 415.104 263.744 438.336-25.152 29.568-50.368 70.784-39.104 108.928 12.608 43.136 62.72 63.232 157.632 63.232 7.872 0 11.52 9.408 4.352 19.52-21.248 29.248-77.888 63.424-167.68 63.424V1024c138.944 0 215.936-74.816 215.936-126.528a46.72 46.72 0 0 0-16.32-36.608 56.32 56.32 0 0 0-36.416-11.456zM297.152 297.472c0 44.032-38.144 25.344-38.144-38.656 0-108.032 85.248-195.712 190.592-195.712 62.592 0 81.216 39.232 38.08 39.232-105.152 0.064-190.528 87.04-190.528 195.136z"
                  p-id="5841"
              ></path>
            </svg>
          </span>
          <span>{{ row.displayId }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column
          :title="$t('m.Title')"
          field="displayTitle"
          min-width="200"
      ></vxe-table-column>

      <!-- 以下列只有在实时刷新榜单的情况下才显示 -->
      <vxe-table-column :title="$t('m.AC')" field="ac" min-width="80">
        <template v-slot="{ row }">
          <span v-if="!ContestRealTimePermission">
            <i
                class="fa fa-question"
                style="font-weight: 600;font-size: 16px;color:#909399"
            ></i>
          </span>
          <span v-else>
            {{ row.ac }}
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column :title="$t('m.Total')" field="total" min-width="80">
        <template v-slot="{ row }">
          <span v-if="!ContestRealTimePermission">
            <i
                class="fa fa-question"
                style="font-weight: 600;font-size: 16px;color:#909399"
            ></i>
          </span>
          <span v-else>
            {{ row.total }}
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column :title="$t('m.AC_Rate')" field="ACRate" min-width="120">
        <template v-slot="{ row }">
          <span>
            <el-tooltip
                :content="row.ac + '/' + row.total"
                effect="dark"
                placement="top"
            >
              <el-progress
                  :percentage="getPassingRate(row.ac, row.total)"
                  :stroke-width="20"
                  :text-inside="true"
              ></el-progress>
            </el-tooltip>
          </span>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import {JUDGE_STATUS, RULE_TYPE} from '@/common/constants';
import api from '@/common/api';

export default {
  name: 'ContestProblemList',
  data() {
    return {
      JUDGE_STATUS: {},
      RULE_TYPE: {},
      isGetStatusOk: false,
      testcolor: 'rgba(0, 206, 209, 1)',
      // btnLoading: false,
      // contestPassword: '',
    };
  },
  mounted() {
    this.RULE_TYPE = Object.assign({}, RULE_TYPE);
    this.JUDGE_STATUS = Object.assign({}, JUDGE_STATUS);
    this.getContestProblems();
  },
  methods: {
    getContestProblems() {
      // contestMenuDisabled
      // 需要等待getContest获取到比赛的auth 否则就是undefined
      if (this.contestMenuDisabled === false) {
        this.$store.dispatch('getContestProblems').then((res) => {
          if (this.isAuthenticated) {
            let isContestProblemList = true;
            // 如果已登录，则需要查询对当前页面题目列表中各个题目的提交情况
            let pidList = [];
            if (this.problems && this.problems.length > 0) {
              for (let index = 0; index < this.problems.length; index++) {
                pidList.push(this.problems[index].pid);
              }
              api
                  .getUserProblemStatus(
                      pidList,
                      isContestProblemList,
                      this.$route.params.contestID
                  )
                  .then((res) => {
                    let result = res.data.data;
                    for (let index = 0; index < this.problems.length; index++) {
                      this.problems[index]['myStatus'] =
                          result[this.problems[index].pid]['status'];
                      this.problems[index]['score'] =
                          result[this.problems[index].pid]['score'];
                    }
                    this.isGetStatusOk = true;
                  });
            }
          }
        });
      }
    },
    goContestProblem(event) {
      this.$router.push({
        name: 'ContestProblemDetails',
        params: {
          contestID: this.$route.params.contestID,
          problemID: event.row.displayId,
        },
      });
    },
    getPassingRate(ac, total) {
      if (!total) {
        return 0;
      }
      return ((ac / total) * 100).toFixed(2);
    },
    getIconColor(status) {
      return (
          'font-weight: 600;font-size: 16px;color:' + JUDGE_STATUS[status].rgb
      );
    },
    getScoreColor(score) {
      if (score == 0) {
        return 'el-tag el-tag--small oi-0';
      } else if (score > 0 && score < 100) {
        return 'el-tag el-tag--small oi-between';
      } else if (score == 100) {
        return 'el-tag el-tag--small oi-100';
      }
    },
  },
  watch: {
    contestMenuDisabled(newValue, oldValue){
      this.getContestProblems()
    }
  },
  computed: {
    ...mapState({
      problems: (state) => state.contest.contestProblems,
    }),
    ...mapGetters([
      'contestMenuDisabled',
      'isAuthenticated',
      'contestRuleType',
      'ContestRealTimePermission'
    ]),
  },
};
</script>

<style scoped>
@media screen and (min-width: 1050px) {
  /deep/ .vxe-table--body-wrapper {
    overflow-x: hidden !important;
  }
}
</style>
