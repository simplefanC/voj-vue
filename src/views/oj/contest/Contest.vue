<template>
  <div class="contest-body">
    <el-row>
      <el-col :lg="24" :md="24" :xs="24">
        <el-card shadow>
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
                <i
                    class="el-icon-user-solid"
                    style="color:rgb(48, 145, 242);"
                ></i
                >x{{ contest.count }}
              </el-button>
              <template v-if="contest.type == 0">
                <el-button :type="'primary'" size="small">
                  <i class="fa fa-trophy"></i>
                  {{ contest.type | parseContestType }}
                </el-button>
              </template>
              <template v-else>
                <el-tooltip
                    :content="
                    $t('m.Contest_Rank') +
                      '：' +
                      (contest.oiRankScoreType == 'Recent'
                        ? $t(
                            'm.Based_on_The_Recent_Score_Submitted_Of_Each_Problem'
                          )
                        : $t(
                            'm.Based_on_The_Highest_Score_Submitted_For_Each_Problem'
                          ))
                  "
                    placement="top"
                >
                  <el-button :type="'warning'" size="small">
                    <i class="fa fa-trophy"></i>
                    {{ contest.type | parseContestType }}
                  </el-button>
                </el-tooltip>
              </template>
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
      </el-col>
    </el-row>
    <div class="sub-menu">
      <el-tabs v-model="route_name" @tab-click="tabClick">
        <!--题目-->
        <el-tab-pane :disabled="contestMenuDisabled" lazy name="ContestProblemList">
          <span slot="label"><i aria-hidden="true" class="fa fa-list"></i>&nbsp;{{ $t('m.Problem') }}</span>
          <!-- 判断是否需要密码验证 -->
          <el-card v-if="passwordFormVisible" class="password-form-card" style="text-align:center;margin-bottom:15px">
            <div slot="header">
              <span class="panel-title" style="color: #e6a23c;"
              ><i class="el-icon-warning">
                  {{ $t('m.Password_Required') }}</i
              ></span
              >
            </div>
            <p class="password-form-tips">
              {{ $t('m.To_Enter_Need_Password') }}
            </p>
            <el-form>
              <el-input
                  v-model="contestPassword"
                  :placeholder="$t('m.Enter_the_contest_password')"
                  style="width:70%"
                  type="password"
                  @keydown.enter.native="checkPassword"
              />
              <el-button
                  style="float:right;"
                  type="primary"
                  @click="checkPassword"
              >{{ $t('m.Enter') }}
              </el-button
              >
            </el-form>
          </el-card>
          <div v-if="!contestMenuDisabled">
            <transition name="el-collapse-transition">
              <router-view
                  v-if="route_name === 'ContestProblemList'"
              ></router-view>
            </transition>
          </div>
        </el-tab-pane>

        <!--简介-->
        <el-tab-pane :disabled="passwordFormVisible" lazy name="ContestDetails">
          <span slot="label"><i class="el-icon-info"></i>&nbsp;{{ $t('m.Overview') }}</span>
          <!--内容-->
          <el-card class="box-card">
            <div
                v-highlight
                class="markdown-body"
                v-html="descriptionHtml"
            ></div>
          </el-card>
        </el-tab-pane>

        <!--提交-->
        <el-tab-pane :disabled="contestMenuDisabled" lazy name="ContestSubmissionList">
          <span slot="label"><i class="el-icon-menu"></i>&nbsp;{{ $t('m.Status') }}</span>
          <transition name="el-collapse-transition">
            <router-view
                v-if="route_name === 'ContestSubmissionList'"
            ></router-view>
          </transition>
        </el-tab-pane>

        <!--rank-->
        <el-tab-pane :disabled="contestMenuDisabled" lazy name="ContestRank">
          <span slot="label"
          ><i aria-hidden="true" class="fa fa-bar-chart"></i>&nbsp;{{
              $t('m.NavBar_Rank')
            }}</span
          >
          <transition name="el-collapse-transition">
            <router-view v-if="route_name === 'ContestRank'"></router-view>
          </transition>
        </el-tab-pane>

        <!--公告-->
        <el-tab-pane :disabled="contestMenuDisabled" lazy name="ContestAnnouncementList">
          <span slot="label"
          ><i aria-hidden="true" class="fa fa-bullhorn"></i>&nbsp;{{
              $t('m.Announcement')
            }}</span
          >
          <transition name="el-collapse-transition">
            <router-view
                v-if="route_name === 'ContestAnnouncementList'"
            ></router-view>
          </transition>
        </el-tab-pane>

        <!--讨论-->
        <el-tab-pane :disabled="contestMenuDisabled" lazy name="ContestComment">
          <span slot="label"><i aria-hidden="true" class="fa fa-commenting"></i>&nbsp;{{ $t('m.Comment') }}</span>
          <transition name="el-collapse-transition">
            <router-view v-if="route_name === 'ContestComment'"></router-view>
          </transition>
        </el-tab-pane>

        <!--打印-->
        <el-tab-pane v-if="contest.openPrint" :disabled="contestMenuDisabled" lazy name="ContestPrint">
          <span slot="label"><i class="el-icon-printer"></i>&nbsp;{{ $t('m.Print') }}</span>
          <transition name="el-collapse-transition">
            <router-view v-if="route_name === 'ContestPrint'"></router-view>
          </transition>
        </el-tab-pane>

        <!--admin helper-->
        <el-tab-pane v-if="showAdminHelper" :disabled="contestMenuDisabled" lazy name="ContestACInfo">
          <span slot="label"><i aria-hidden="true" class="el-icon-s-help"></i>&nbsp;{{ $t('m.Admin_Helper') }}</span>
          <transition name="el-collapse-transition">
            <router-view v-if="route_name === 'ContestACInfo'"></router-view>
          </transition>
        </el-tab-pane>

        <!--admin打印-->
        <el-tab-pane v-if="isSuperAdmin && contest.openPrint" :disabled="contestMenuDisabled" lazy
                     name="ContestAdminPrint">
          <span slot="label"><i class="el-icon-printer"></i>&nbsp;{{ $t('m.Admin_Print') }}</span>
          <transition name="el-collapse-transition">
            <router-view
                v-if="route_name === 'ContestAdminPrint'"
            ></router-view>
          </transition>
        </el-tab-pane>

        <!--重测-->
        <el-tab-pane v-if="isSuperAdmin" :disabled="contestMenuDisabled" lazy name="ContestRejudgeAdmin">
          <span slot="label"
          ><i aria-hidden="true" class="el-icon-refresh"></i>&nbsp;{{
              $t('m.Rejudge')
            }}</span
          >
          <transition name="el-collapse-transition">
            <router-view
                v-if="route_name === 'ContestRejudgeAdmin'"
            ></router-view>
          </transition>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import time from '@/common/time';
import moment from 'moment';
import api from '@/common/api';
import {mapActions, mapGetters, mapState} from 'vuex';
import {addCodeBtn} from '@/common/codeblock';
import {
  buildContestAnnounceKey,
  CONTEST_STATUS,
  CONTEST_STATUS_REVERSE,
  CONTEST_TYPE_REVERSE,
  RULE_TYPE,
} from '@/common/constants';
import myMessage from '@/common/message';
import storage from '@/common/storage';

export default {
  name: '',
  data() {
    return {
      route_name: 'contestDetails',
      timer: null,
      CONTEST_STATUS: {},
      CONTEST_STATUS_REVERSE: {},
      CONTEST_TYPE_REVERSE: {},
      RULE_TYPE: {},
      btnLoading: false,
      contestPassword: '',
    };
  },
  created() {
    this.contestID = this.$route.params.contestID;
    this.route_name = this.$route.name;
    // this.route_name = 'ContestProblemList';
    if (this.route_name == 'ContestProblemDetails') {
      this.route_name = 'ContestProblemList';
    }
    if (this.route_name == 'ContestSubmissionDetail') {
      this.route_name = 'ContestSubmissionList';
    }
    this.CONTEST_TYPE_REVERSE = Object.assign({}, CONTEST_TYPE_REVERSE);
    this.CONTEST_STATUS = Object.assign({}, CONTEST_STATUS);
    this.CONTEST_STATUS_REVERSE = Object.assign({}, CONTEST_STATUS_REVERSE);
    this.RULE_TYPE = Object.assign({}, RULE_TYPE);
    this.$store.dispatch('getContest').then((res) => {
      this.changeDomTitle({title: res.data.data.title});
      let data = res.data.data;
      let endTime = moment(data.endTime);
      // 如果当前时间还是在比赛结束前的时间，需要计算倒计时，同时开启获取比赛公告的定时器
      if (endTime.isAfter(moment(data.now))) {
        // 实时更新时间
        this.timer = setInterval(() => {
          this.$store.commit('nowAdd1s');
        }, 1000);

        // 每分钟获取一次是否存在未阅读的公告
        this.announceTimer = setInterval(() => {
          let key = buildContestAnnounceKey(this.userInfo.uid, this.contestID);
          let readAnnouncementList = storage.get(key) || [];
          let data = {
            cid: this.contestID,
            readAnnouncementList: readAnnouncementList,
          };

          api.getContestUserNotReadAnnouncement(data).then((res) => {
            let newAnnounceList = res.data.data;
            for (let i = 0; i < newAnnounceList.length; i++) {
              readAnnouncementList.push(newAnnounceList[i].id);
              this.$notify({
                title: newAnnounceList[i].title,
                message:
                    '<p style="text-align:center;"><i class="el-icon-time"> ' +
                    time.utcToLocal(newAnnounceList[i].gmtCreate) +
                    '</i></p>' +
                    '<p style="text-align:center;color:#409eff">' +
                    this.$i18n.t(
                        'm.Please_check_the_contest_announcement_for_details'
                    ) +
                    '</p>',
                type: 'warning',
                dangerouslyUseHTMLString: true,
                duration: 0,
              });
            }
            storage.set(key, readAnnouncementList);
          });
        }, 60 * 1000);
      }

      this.$nextTick((_) => {
        addCodeBtn();
      });
    });

  },
  methods: {
    ...mapActions(['changeDomTitle']),
    formatTooltip(val) {
      if (this.contest.status == -1) {
        // 还未开始
        return '00:00:00';
      } else if (this.contest.status == 0) {
        return time.secondFormat(this.BeginToNowDuration); // 格式化时间
      } else {
        return time.secondFormat(this.contest.duration);
      }
    },
    checkPassword() {
      if (this.contestPassword === '') {
        myMessage.warning(this.$i18n.t('m.Enter_the_contest_password'));
        return;
      }
      this.btnLoading = true;
      api.registerContest(this.contestID + '', this.contestPassword).then(
          (res) => {
            myMessage.success(this.$i18n.t('m.Register_contest_successfully'));
            this.$store.commit('contestIntoAccess', {intoAccess: true});
            this.btnLoading = false;
          },
          (res) => {
            this.btnLoading = false;
          }
      );
    },
    tabClick(tab) {
      let name = tab.name;
      if (name !== this.$route.name) {
        this.$router.push({name: name});
      }
    },
  },
  computed: {
    ...mapState({
      contest: (state) => state.contest.contest,
      now: (state) => state.contest.now,
    }),
    ...mapGetters([
      'contestMenuDisabled',
      'contestRuleType',
      'contestStatus',
      'countdown',
      'BeginToNowDuration',
      'isContestAdmin',
      'isSuperAdmin',
      'ContestRealTimePermission',
      'passwordFormVisible',
      'userInfo',
    ]),
    progressValue: {
      get: function () {
        return this.$store.getters.progressValue;
      },
      set: function () {
      },
    },
    timeStep() {
      // 时间段平分滑条长度
      return 100 / this.contest.duration;
    },
    countdownColor() {
      if (this.contestStatus) {
        return 'color:' + CONTEST_STATUS_REVERSE[this.contestStatus].color;
      }
    },
    showAdminHelper() {
      return this.isContestAdmin && this.contestRuleType === RULE_TYPE.ACM;
    },
    descriptionHtml() {
      if (this.contest.description) {
        return this.$markDown.render(this.contest.description);
      }
    },
    contestEnded() {
      return this.contestStatus === CONTEST_STATUS.ENDED;
    },
  },
  watch: {
    $route(newVal) {
      this.route_name = newVal.name;
      if (newVal.name == 'ContestProblemDetails') {
        this.route_name = 'ContestProblemList';
      }
      if (this.route_name == 'ContestSubmissionDetail') {
        this.route_name = 'ContestSubmissionList';
      }
      this.contestID = newVal.params.contestID;
      this.changeDomTitle({title: this.contest.title});
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.announceTimer);
    this.$store.commit('clearContest');
  },
};
</script>
<style scoped>
.panel-title {
  font-size: 1.5rem !important;
  font-weight: 500;
}

@media screen and (min-width: 768px) {
  .contest-time .left {
    text-align: left;
  }

  .contest-time .right {
    text-align: right;
  }

  .password-form-card {
    width: 400px;
    margin: 0 auto;
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

/deep/ .el-card__header {
  border-bottom: 0px;
  padding-bottom: 0px;
}

/deep/ .el-tabs__nav-wrap {
  background: #fff;
  border-radius: 3px;
}

/deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 20px;
}

.contest-title {
  text-align: center;
}

.contest-time {
  width: 100%;
  font-size: 16px;
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

.sub-menu {
  margin-top: 15px;
}

.password-form-tips {
  text-align: center;
  font-size: 14px;
}
</style>
