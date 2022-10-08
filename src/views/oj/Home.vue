<template>
  <div>
    <el-row :gutter="30">
      <el-col :md="15" :sm="24">
        <el-card>
          <div slot="header" class="clearfix title content-center">
            <div class="home-title home-contest">
              {{ $t('m.Recent_Contest') }}
            </div>
          </div>
          <div v-loading="loading.recentContests">
            <p v-show="contests.length == 0" id="no-contest">
              <el-empty :description="$t('m.No_contest')"></el-empty>
            </p>
            <ol id="contest-list">
              <li
                  v-for="contest in contests"
                  :key="contest.title"
              >
                <el-row align="middle" justify="space-between" type="flex">
                  <el-col :lg="4" :md="3" :sm="4" :xs="10">
                    <img
                        v-show="contest.type == 0"
                        :src="acmSrc"
                        class="trophy"
                        width="95px"
                    />
                    <img
                        v-show="contest.type == 1"
                        :src="oiSrc"
                        class="trophy"
                        width="95px"
                    />
                  </el-col>
                  <el-col :lg="18" :md="19" :sm="16" :xs="10" class="contest-main">
                    <p class="title">
                      <a class="entry" @click.stop="goContest(contest.id)">
                        {{ contest.title }}
                      </a>
                      <template v-if="contest.auth == 1">
                        <i
                            class="el-icon-lock"
                            size="20"
                            style="color:#d9534f"
                        ></i>
                      </template>
                      <template v-if="contest.auth == 2">
                        <i
                            class="el-icon-lock"
                            size="20"
                            style="color:#f0ad4e"
                        ></i>
                      </template>
                    </p>
                    <ul class="detail">
                      <li>
                        <i
                            aria-hidden="true"
                            class="fa fa-calendar"
                            style="color: #3091f2"
                        ></i>
                        {{ contest.startTime | localtime }}
                      </li>
                      <li>
                        <i
                            aria-hidden="true"
                            class="fa fa-clock-o"
                            style="color: #3091f2"
                        ></i>
                        {{ getDuration(contest.startTime, contest.endTime) }}
                      </li>
                      <li>
                        <el-button
                            :type="contest.type == 0 ? 'primary' : 'warning'"
                            round
                            size="mini"
                            @click="goContestList(contest.type)"
                        ><i class="fa fa-trophy"></i>
                          {{ contest.type | parseContestType }}
                        </el-button>
                      </li>
                      <li>
                        <el-tooltip
                            :content="
              $t('m.' + CONTEST_TYPE_REVERSE[contest.auth].tips)
            "
                            effect="light"
                            placement="top"
                        >
                          <el-tag
                              :type="CONTEST_TYPE_REVERSE[contest.auth]['color']"
                              effect="plain"
                          >
                            {{
                              $t(
                                  'm.' + CONTEST_TYPE_REVERSE[contest.auth]['name']
                              )
                            }}
                          </el-tag>
                        </el-tooltip>
                      </li>
                      <li v-if="contest.count != null">
                        <i
                            class="el-icon-user-solid"
                            style="color:rgb(48, 145, 242);"
                        ></i
                        >x{{ contest.count }}
                      </li>
                    </ul>
                  </el-col>
                  <el-col :lg="2" :md="2" :sm="4" :xs="4" style="text-align: center">
                    <el-tag
                        :color="CONTEST_STATUS_REVERSE[contest.status]['color']"
                        effect="dark"
                        size="medium"
                    >
                      <i aria-hidden="true" class="fa fa-circle"></i>
                      {{
                        $t('m.' + CONTEST_STATUS_REVERSE[contest.status]['name'])
                      }}
                    </el-tag>
                  </el-col>
                </el-row>
              </li>
            </ol>
          </div>
          <!--            <el-card-->
          <!--                shadow="hover"-->
          <!--                v-for="(contest, index) in contests"-->
          <!--                :key="index"-->
          <!--                class="contest-card"-->
          <!--                :class="-->
          <!--                contest.status == 0-->
          <!--                  ? 'contest-card-running'-->
          <!--                  : 'contest-card-schedule'-->
          <!--              "-->
          <!--            >-->
          <!--              <div slot="header" class="clearfix contest-header">-->
          <!--                <a class="contest-title" @click="goContest(contest.id)">{{-->
          <!--                    contest.title-->
          <!--                  }}</a>-->
          <!--                <div class="contest-status">-->
          <!--                  <el-tag-->
          <!--                      effect="dark"-->
          <!--                      size="medium"-->
          <!--                      :color="CONTEST_STATUS_REVERSE[contest.status]['color']"-->
          <!--                  >-->
          <!--                    <i class="fa fa-circle" aria-hidden="true"></i>-->
          <!--                    {{-->
          <!--                      $t('m.' + CONTEST_STATUS_REVERSE[contest.status]['name'])-->
          <!--                    }}-->
          <!--                  </el-tag>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--              <div class="contest-type-auth">-->
          <!--                <el-button-->
          <!--                    :type="contest.type == 0 ? 'primary' : 'warning'"-->
          <!--                    round-->
          <!--                    @click="goContestList(contest.type)"-->
          <!--                    size="mini"-->
          <!--                    style="margin-right: 10px;"-->
          <!--                ><i class="fa fa-trophy"></i>-->
          <!--                  {{ contest.type | parseContestType }}-->
          <!--                </el-button>-->
          <!--                <el-tooltip-->
          <!--                    :content="$t('m.' + CONTEST_TYPE_REVERSE[contest.auth].tips)"-->
          <!--                    placement="top"-->
          <!--                    effect="light"-->
          <!--                >-->
          <!--                  <el-tag-->
          <!--                      :type="CONTEST_TYPE_REVERSE[contest.auth]['color']"-->
          <!--                      size="medium"-->
          <!--                      effect="plain"-->
          <!--                  >-->
          <!--                    {{ $t('m.' + CONTEST_TYPE_REVERSE[contest.auth]['name']) }}-->
          <!--                  </el-tag>-->
          <!--                </el-tooltip>-->
          <!--              </div>-->
          <!--              <ul class="contest-info">-->
          <!--                <li>-->
          <!--                  <el-button-->
          <!--                      type="primary"-->
          <!--                      round-->
          <!--                      size="mini"-->
          <!--                      style="margin-top: 4px;"-->
          <!--                  ><i class="fa fa-calendar"></i>-->
          <!--                    {{-->
          <!--                      contest.startTime | localtime((format = 'MM-DD HH:mm'))-->
          <!--                    }}-->
          <!--                  </el-button>-->
          <!--                </li>-->
          <!--                <li>-->
          <!--                  <el-button-->
          <!--                      type="success"-->
          <!--                      round-->
          <!--                      size="mini"-->
          <!--                      style="margin-top: 4px;"-->
          <!--                  ><i class="fa fa-clock-o"></i>-->
          <!--                    {{ getDuration(contest.startTime, contest.endTime) }}-->
          <!--                  </el-button>-->
          <!--                </li>-->
          <!--                <li>-->
          <!--                  <el-button-->
          <!--                      size="mini"-->
          <!--                      round-->
          <!--                      plain-->
          <!--                      v-if="contest.count != null"-->
          <!--                  >-->
          <!--                    <i-->
          <!--                        class="el-icon-user-solid"-->
          <!--                        style="color:rgb(48, 145, 242);"-->
          <!--                    ></i-->
          <!--                    >x{{ contest.count }}-->
          <!--                  </el-button>-->
          <!--                </li>-->
          <!--              </ul>-->
          <!--            </el-card>-->

        </el-card>
        <Announcements class="card-top"></Announcements>
      </el-col>
      <el-col :md="9" :sm="24" class="phone-margin">
        <el-card>
          <div slot="header" class="clearfix title">
            <span class="home-title panel-title">
              {{ $t('m.Supported_Remote_Online_Judge') }}
            </span>
          </div>
          <el-row :gutter="20">
            <el-col
                v-for="(oj, index) in remoteJudgeList"
                :key="index"
                :md="8"
                :sm="12"
                style="margin-bottom: 10px"
            >
              <a :class="oj.status ? 'oj-normal' : 'oj-error'" :href="oj.url" target="_blank">
                <img :src="oj.logo" class="oj-logo"/>
                {{ oj.name }}
              </a>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="card-top">
          <div slot="header" class="clearfix">
            <span class="panel-title home-title">{{
                $t('m.Recent_7_Days_AC_Rank')
              }}</span>
          </div>
          <vxe-table
              :data="recentUserACRecord"
              :loading="loading.recent7ACRankLoading"
              align="center"
              auto-resize
              border="inner"
              max-height="500px"
              stripe
          >
            <vxe-table-column min-width="50" type="seq">
              <template v-slot="{ rowIndex }">
                <span :class="getRankTagClass(rowIndex)"
                >{{ rowIndex + 1 }}
                </span>
                <span :class="'cite no' + rowIndex"></span>
              </template>
            </vxe-table-column>
            <vxe-table-column
                :title="$t('m.Username')"
                align="left"
                field="username"
                min-width="150"
            >
              <template v-slot="{ row }">
                <avatar
                    :inline="true"
                    :size="25"
                    :src="row.avatar"
                    :username="row.username"
                    class="user-avatar"
                    color="#FFF"
                ></avatar>
                <a
                    style="color:#2d8cf0;"
                    @click="goUserHome(row.username, row.uid)"
                >{{ row.username }}</a
                >
              </template>
            </vxe-table-column>
            <vxe-table-column
                :title="$t('m.AC')"
                align="left"
                field="ac"
                min-width="50"
            >
            </vxe-table-column>
            <!--            <vxe-table-column-->
            <!--              field="total"-->
            <!--              :title="$t('m.Total')"-->
            <!--              min-width="50"-->
            <!--              align="left"-->
            <!--            >-->
            <!--            </vxe-table-column>-->
          </vxe-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import time from '@/common/time';
import api from '@/common/api';
import {CONTEST_STATUS_REVERSE, CONTEST_TYPE_REVERSE,} from '@/common/constants';
import {mapGetters, mapState} from 'vuex';
import Avatar from 'vue-avatar';
import myMessage from '@/common/message';

const Announcements = () => import('@/components/oj/common/Announcements.vue');
export default {
  name: 'home',
  components: {
    Announcements,
    Avatar,
  },
  data() {
    return {
      interval: 5000,
      otherContests: [],
      recentUserACRecord: [],
      CONTEST_STATUS_REVERSE: {},
      CONTEST_TYPE_REVERSE: {},
      contests: [],
      loading: {
        recent7ACRankLoading: false,
        recentOtherContestsLoading: false,
        recentContests: false,
      },
      acmSrc: require('@/assets/acm.jpg'),
      oiSrc: require('@/assets/oi.jpg'),
      carouselImgList: [
        {
          url: 'https://cdn.jsdelivr.net/gh/HimitZH/CDN/images/home1.jfif',
        },
        {
          url: 'https://cdn.jsdelivr.net/gh/HimitZH/CDN/images/home2.jpeg',
        },
      ],
      srcHight: '440px',
      remoteJudgeList: [
        {
          url: 'http://acm.hdu.edu.cn',
          name: 'HDU',
          logo: require('@/assets/remotejudgelogo/hdu.png'),
          status: true,
        },
        {
          url: 'http://poj.org',
          name: 'POJ',
          logo: require('@/assets/remotejudgelogo/poj.png'),
          status: true,
        },
        {
          url: 'https://codeforces.com',
          name: 'Codeforces',
          logo: require('@/assets/remotejudgelogo/codeforces.png'),
          status: true,
        },
        // {
        //   url: 'https://codeforces.com/gyms',
        //   name: 'GYM',
        //   logo: require('@/assets/gym-logo.png'),
        //   status: true,
        // },
        {
          url: 'https://atcoder.jp',
          name: 'AtCoder',
          logo: require('@/assets/remotejudgelogo/atcoder.png'),
          status: true,
        },
        // {
        //   url: 'https://www.spoj.com',
        //   name: 'SPOJ',
        //   logo: require('@/assets/spoj-logo.png'),
        //   status: true,
        // },
        {
          url: 'https://www.maxuetang.cn',
          name: 'MXT',
          logo: require('@/assets/remotejudgelogo/mxt.png'),
          status: true,
        },
        {
          url: 'https://nanti.jisuanke.com',
          name: 'JSK',
          logo: require('@/assets/remotejudgelogo/jsk.png'),
          status: true,
        },
        {
          url: 'http://tk.hustoj.com',
          name: 'TKOJ',
          logo: require('@/assets/remotejudgelogo/tkoj.png'),
          status: true,
        },
      ],
    };
  },
  mounted() {
    let screenWidth = window.screen.width;
    if (screenWidth < 768) {
      this.srcHight = '200px';
    } else {
      this.srcHight = '440px';
    }
    this.CONTEST_STATUS_REVERSE = Object.assign({}, CONTEST_STATUS_REVERSE);
    this.CONTEST_TYPE_REVERSE = Object.assign({}, CONTEST_TYPE_REVERSE);
    // this.getHomeCarousel();
    this.getRecentContests();
    this.getRecent7ACRank();
    // this.getRecentOtherContests();
  },
  methods: {
    getHomeCarousel() {
      api.getHomeCarousel().then((res) => {
        if (res.data.data != null && res.data.data.length > 0) {
          this.carouselImgList = res.data.data;
        }
      });
    },

    getRecentContests() {
      this.loading.recentContests = true;
      api.getRecentContests().then(
          (res) => {
            this.contests = res.data.data;
            this.loading.recentContests = false;
          },
          (err) => {
            this.loading.recentContests = false;
          }
      );
    },
    getRecentOtherContests() {
      this.loading.recentOtherContestsLoading = true;
      api.getRecentOtherContests().then(
          (res) => {
            this.otherContests = res.data.data;
            this.loading.recentOtherContestsLoading = false;
          },
          (err) => {
            this.loading.recentOtherContestsLoading = false;
          }
      );
    },
    getRecent7ACRank() {
      this.loading.recent7ACRankLoading = true;
      api.getRecent7ACRank().then(
          (res) => {
            this.recentUserACRecord = res.data.data;
            this.loading.recent7ACRankLoading = false;
          },
          (err) => {
            this.loading.recent7ACRankLoading = false;
          }
      );
    },
    goContest(cid) {
      if (!this.isAuthenticated) {
        myMessage.warning(this.$i18n.t('m.Please_login_first'));
        this.$store.dispatch('changeModalStatus', {visible: true});
      } else {
        this.$router.push({
          name: 'ContestProblemList',
          params: {contestID: cid},
        });
      }
    },
    goContestList(type) {
      this.$router.push({
        name: 'ContestList',
        query: {
          type,
        },
      });
    },

    goOtherOJContest(event) {
      window.open(event.row.url);
    },
    goUserHome(username, uid) {
      this.$router.push({
        path: '/user-home',
        query: {uid, username},
      });
    },
    getDuration(startTime, endTime) {
      return time.formatSpecificDuration(startTime, endTime);
    },
    getRankTagClass(rowIndex) {
      return 'rank-tag no' + (rowIndex + 1);
    },
    toUpper(str) {
      if (str) {
        return str.toUpperCase();
      }
    },
  },
  computed: {
    ...mapState(['websiteConfig']),
    ...mapGetters(['isAuthenticated']),
  },
};
</script>
<style>
.contest-card-running {
  border-color: rgb(25, 190, 107);
}

.contest-card-schedule {
  border-color: #f90;
}
</style>
<style scoped>
/deep/ .el-card__header {
  padding: 0.6rem 1.25rem !important;
}

.card-top {
  margin-top: 20px;
}

.home-contest {
  text-align: left;
  font-size: 21px;
  font-weight: 500;
  line-height: 30px;
}

.oj-logo {
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 5px;
  /*margin-bottom: 1rem;*/
  width: 35px;
  margin-right: 5px;
  vertical-align: middle;
  /*padding: 0.5rem 1rem;*/
  /*background: rgb(255, 255, 255);*/
  /*min-height: 47px;*/
}

.oj-normal {
  display: block;
  font-size: 14px;
  color: #409eff;
}

.oj-error {
  display: block;
  font-size: 14px;
  color: #e65c47;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.contest-card {
  margin-bottom: 20px;
}

.contest-title {
  font-size: 1.15rem;
  font-weight: 600;
}

.contest-type-auth {
  text-align: center;
  margin-top: -10px;
  margin-bottom: 5px;
}

ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}

.contest-info {
  text-align: center;
}

.contest-info li {
  display: inline-block;
  padding-right: 10px;
}

/deep/ .contest-card-running .el-card__header {
  border-color: rgb(25, 190, 107);
  background-color: rgba(94, 185, 94, 0.15);
}

.contest-card-running .contest-title {
  color: #5eb95e;
}

/deep/ .contest-card-schedule .el-card__header {
  border-color: #f90;
  background-color: rgba(243, 123, 29, 0.15);
}

.contest-card-schedule .contest-title {
  color: #f37b1d;
}

.content-center {
  text-align: center;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.welcome-title {
  font-weight: 600;
  font-size: 25px;
  font-family: 'Raleway';
}

.contest-status {
  float: right;
}

.img-carousel {
  height: 490px;
}

@media screen and (max-width: 768px) {
  .contest-status {
    text-align: center;
    float: none;
    margin-top: 5px;
  }

  .contest-header {
    text-align: center;
  }

  .img-carousel {
    height: 220px;
    overflow: hidden;
  }

  .phone-margin {
    margin-top: 20px;
  }
}

.title .el-link {
  font-size: 21px;
  font-weight: 500;
  color: #444;
}

.clearfix h2 {
  color: #409eff;
}

.el-link.el-link--default:hover {
  color: #409eff;
  transition: all 0.28s ease;
}

.contest .content-info {
  padding: 0 70px 40px 70px;
}

.contest .contest-description {
  margin-top: 25px;
}

span.rank-tag.no1 {
  line-height: 24px;
  background: #bf2c24;
}

span.rank-tag.no2 {
  line-height: 24px;
  background: #e67225;
}

span.rank-tag.no3 {
  line-height: 24px;
  background: #e6bf25;
}

span.rank-tag {
  font: 16px/22px FZZCYSK;
  min-width: 14px;
  height: 22px;
  padding: 0 4px;
  text-align: center;
  color: #fff;
  background: #000;
  background: rgba(0, 0, 0, 0.6);
}

.user-avatar {
  margin-right: 5px !important;
  vertical-align: middle;
}

.cite {
  display: block;
  width: 14px;
  height: 0;
  margin: 0 auto;
  margin-top: -3px;
  border-right: 11px solid transparent;
  border-bottom: 0 none;
  border-left: 11px solid transparent;
}

.cite.no0 {
  border-top: 5px solid #bf2c24;
}

.cite.no1 {
  border-top: 5px solid #e67225;
}

.cite.no2 {
  border-top: 5px solid #e6bf25;
}

@media screen and (min-width: 1050px) {
  /deep/ .vxe-table--body-wrapper {
    overflow-x: hidden !important;
  }
}

#contest-list > li {
  padding: 5px;
  margin-left: -20px;
  margin-top: 10px;
  width: 100%;
  border-bottom: 1px solid rgba(187, 187, 187, 0.5);
  list-style: none;
}

#contest-list .trophy {
  height: 70px;
  margin-left: 10px;
  margin-right: -20px;
}

#contest-list .contest-main {
  text-align: left;
}

#contest-list .contest-main .title {
  font-size: 1.25rem;
  padding-left: 8px;
  margin-bottom: 0;
}

#contest-list .contest-main .title a.entry {
  color: #495060;
}

#contest-list .contest-main .title a:hover {
  color: #2d8cf0;
  border-bottom: 1px solid #2d8cf0;
}

#contest-list .contest-main .detail {
  font-size: 0.875rem;
  padding-left: 0;
  padding-bottom: 10px;
}

#contest-list .contest-main li {
  display: inline-block;
  padding: 10px 0 0 10px;
}
</style>
