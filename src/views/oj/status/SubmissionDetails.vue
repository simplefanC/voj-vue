<template>
  <el-row justify="space-around" type="flex">
    <el-col id="status" :span="24">
      <el-alert
          :class="getBackgroundColor(submission.status)"
          :closable="false"
          :type="status.type"
          effect="dark"
          show-icon
          style="padding: 18px;"
      >
        <template slot="title">
          <span class="title">{{ status.statusName }}</span>
        </template>
        <template slot>
          <div v-if="isCE || isSE || isSF" class="content">
            <pre>{{ submission.errorMessage }}</pre>
          </div>
          <div v-else class="content">
            <span class="span-row"
            >{{ $t('m.Time') }}:
              {{ submissionTimeFormat(submission.time) }}</span
            >
            <span class="span-row"
            >{{ $t('m.Memory') }}:
              {{ submissionMemoryFormat(submission.memory) }}</span
            >
            <span class="span-row"
            >{{ $t('m.Length') }}:
              {{ submissionLengthFormat(submission.length) }}</span
            >
            <span class="span-row"
            >{{ $t('m.Language') }}: {{ submission.language }}</span
            >
            <span class="span-row"
            >{{ $t('m.Author') }}: {{ submission.username }}</span
            >
          </div>
        </template>
      </el-alert>
    </el-col>

    <el-col v-if="tableData && !isCE" :span="24">
      <vxe-table
          :data="tableData"
          :loading="loadingTable"
          align="center"
          auto-resize
          stripe
          style="padding-top: 13px;"
      >
        <vxe-table-column
            :title="$t('m.Run_ID')"
            field="submitId"
            width="100"
        ></vxe-table-column>
        <vxe-table-column :title="$t('m.Submit_Time')" min-width="160">
          <template v-slot="{ row }">
            <span>{{ row.submitTime | localtime }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Problem_ID')"
            field="pid"
            min-width="100"
        >
          <template v-slot="{ row }">
            <a style="color: rgb(87, 163, 243)" @click="getProblemUri(row)">{{
                row.displayPid
              }}</a>
          </template>
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Status')"
            field="status"
            min-width="160"
        >
          <template v-slot="{ row }">
            <span :class="getStatusColor(row.status)">{{
                JUDGE_STATUS[row.status].name
              }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column :title="$t('m.Time')" min-width="96">
          <template v-slot="{ row }">
            <span>{{ submissionTimeFormat(row.time) }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column :title="$t('m.Memory')" min-width="96">
          <template v-slot="{ row }">
            <span>{{ submissionMemoryFormat(row.memory) }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column
            v-if="isIOProblem"
            :title="$t('m.Score')"
            min-width="64"
        >
          <template v-slot="{ row }">
            <template v-if="row.score != null">
              <el-tooltip placement="top">
                <div slot="content">
                  {{ $t('m.Problem_Score') }}：{{
                    row.score != null ? row.score : $t('m.Unknown')
                  }}<br/>{{ $t('m.OI_Rank_Score') }}：{{
                    row.oiRankScore != null ? row.oiRankScore : $t('m.Unknown')
                  }}<br/>
                  {{
                    $t('m.OI_Rank_Calculation_Rule')
                  }}:(score*0.1+diffculty*2)*(ac_testcase/sum_testcase)
                </div>
                <span>{{ row.score }}</span>
              </el-tooltip>
            </template>
            <template v-else>
              <span>--</span>
            </template>
          </template>
        </vxe-table-column>
        <vxe-table-column :title="$t('m.Length')" min-width="80">
          <template v-slot="{ row }">
            <span>{{ submissionLengthFormat(row.length) }}</span>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-col>
    <el-col v-if="testCaseResult" :span="24">
      <el-card shadow="hover" style="margin-top: 13px;">
        <div slot="header">
          <span class="panel-title home-title">{{
              $t('m.Test_point_details')
            }}</span>
        </div>
        <el-row :gutter="10">
          <el-col
              v-for="(item, index) in testCaseResult"
              :key="index"
              :lg="3"
              :md="6"
              :sm="8"
              :xs="24"
          >
            <el-tooltip placement="top">
              <div slot="content">
                {{ $t('m.Input_File') }}：{{
                  item.inputData ? item.inputData : $t('m.Unknown')
                }}<br/>{{ $t('m.Output_File') }}：{{
                  item.outputData ? item.outputData : $t('m.Unknown')
                }}
                <br/>{{ $t('m.Case_tips') }}：{{
                  item.userOutput ? item.userOutput : $t('m.Unknown')
                }}
              </div>
              <div
                  v-if="item.status == JUDGE_STATUS_RESERVE.ac"
                  :style="getTestCaseResultColor(item.status)"
                  class="test-detail-item"
              >
                <div @click="downloadSingleTestCase(item)">
                  <span>Test #{{ index + 1 }}:</span>
                  <div v-if="downCaseAuthentication" style="float: right"><i class="fa fa-download fa-lg" aria-hidden="true"></i></div>
                </div>
                <h2>{{ JUDGE_STATUS[item.status]['short'] }}</h2>
                <div style="text-align:center;">
                  {{ item.time }}ms/{{ item.memory }}KB
                </div>
                <div class="test-run-static">
                  <span v-if="item.score != null">
                    {{ item.score }} <i class="el-icon-success"></i>
                  </span>
                  <span v-else>
                    <i class="el-icon-success"></i>
                  </span>
                </div>
              </div>
              <div
                  v-else
                  :style="getTestCaseResultColor(item.status)"
                  class="test-detail-item"
              >
                <div @click="downloadSingleTestCase(item)">
                  <span>Test #{{ index + 1 }}:</span>
                  <div v-if="downCaseAuthentication" style="float: right"><i class="fa fa-download fa-lg" aria-hidden="true"></i></div>
                </div>
                <h2>{{ JUDGE_STATUS[item.status]['short'] }}</h2>
                <div style="text-align:center;">
                  {{ item.time }}ms/{{ item.memory }}KB
                </div>
                <div class="test-run-static">
                  <span v-if="item.score != null">
                    {{ item.score }} <i class="el-icon-error"></i>
                  </span>
                  <span v-else>
                    <i class="el-icon-error"></i>
                  </span>
                </div>
              </div>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <template
        v-if="
        (submission.code && submission.share && codeShare) ||
          isMySubmission ||
          isAdminRole
      "
    >
      <el-col v-if="submission.code" :span="24" style="margin-top: 13px;">
        <Highlight
            :border-color.sync="status.color"
            :code="submission.code"
            :language="submission.language"
        ></Highlight>
      </el-col>
      <el-col :span="24">
        <div id="share-btn">
          <el-button
              v-if="submission.code"
              icon="el-icon-document-copy"
              size="large"
              type="primary"
              @click="doCopy"
          >{{ $t('m.Copy') }}
          </el-button
          >
          <template v-if="codeShare && isMySubmission">
            <el-button
                v-if="submission.share"
                icon="el-icon-circle-close"
                size="large"
                type="warning"
                @click="shareSubmission(false)"
            >
              {{ $t('m.Unshared') }}
            </el-button>
            <el-button
                v-else-if="!submission.share"
                icon="el-icon-share"
                size="large"
                type="primary"
                @click="shareSubmission(true)"
            >
              {{ $t('m.Shared') }}
            </el-button>
          </template>
        </div>
      </el-col>
    </template>
  </el-row>
</template>

<script>
import api from '@/common/api';
import {JUDGE_STATUS, JUDGE_STATUS_RESERVE} from '@/common/constants';
import utils from '@/common/utils';
import myMessage from '@/common/message';
import {addCodeBtn} from '@/common/codeblock';
import Highlight from '@/components/oj/common/Highlight';
import {mapGetters} from "_vuex@3.6.2@vuex";

export default {
  name: 'submissionDetails',
  components: {
    Highlight,
  },
  data() {
    return {
      submission: {
        code: '',
        submitId: '',
        submitTime: '',
        pid: '',
        cid: '',
        displayPid: '',
        status: 0,
        time: '',
        memory: '',
        language: '',
        author: '',
        errorMessage: '',
        share: true,
      },
      tableData: [],
      testCaseResult: [],
      codeShare: true,
      isIOProblem: false,
      loadingTable: false,
      JUDGE_STATUS: '',
      JUDGE_STATUS_RESERVE: '',
    };
  },
  mounted() {
    this.getSubmission();
    this.getAllCaseResult();
    this.JUDGE_STATUS = Object.assign({}, JUDGE_STATUS);
    this.JUDGE_STATUS_RESERVE = Object.assign({}, JUDGE_STATUS_RESERVE);
  },
  methods: {
    doCopy() {
      this.$copyText(this.submission.code).then(
          () => {
            myMessage.success(this.$i18n.t('m.Copied_successfully'));
          },
          () => {
            myMessage.success(this.$i18n.t('m.Copied_failed'));
          }
      );
    },

    submissionTimeFormat(time) {
      return utils.submissionTimeFormat(time);
    },

    submissionMemoryFormat(memory) {
      return utils.submissionMemoryFormat(memory);
    },

    submissionLengthFormat(length) {
      return utils.submissionLengthFormat(length);
    },

    getProblemUri(row) {
      if (row.cid != 0) {
        // 比赛题目
        this.$router.push({
          name: 'ContestProblemDetails',
          params: {
            contestID: row.cid,
            problemID: row.displayPid,
          },
        });
      } else {
        this.$router.push({
          name: 'ProblemDetails',
          params: {
            problemID: row.displayPid,
          },
        });
      }
    },
    getStatusColor(status) {
      return 'el-tag el-tag--medium status-' + JUDGE_STATUS[status].color;
    },
    getTestCaseResultColor(status) {
      return (
          'color:' +
          JUDGE_STATUS[status].rgb +
          '!important;border-color:' +
          JUDGE_STATUS[status].rgb +
          '!important'
      );
    },
    getBackgroundColor(status) {
      return 'status-' + JUDGE_STATUS[status].color;
    },
    getSubmission() {
      this.loadingTable = true;
      api.getSubmission(this.$route.params.submitID).then(
          (res) => {
            this.loadingTable = false;
            let data = res.data.data;
            if (
                data.submission.memory &&
                data.submission.score &&
                !this.isIOProblem
            ) {
              // score exist means the submission is OI problem submission
              this.isIOProblem = true;
            }
            // 如果是比赛 需要显示的是比赛题号
            if (this.$route.params.problemID && data.submission.cid != 0) {
              data.submission.displayPid = this.$route.params.problemID;
            }
            this.submission = data.submission;
            this.tableData = [data.submission];
            if (data.submission.cid != 0) {
              // 比赛的提交不可分享
              this.codeShare = false;
            } else {
              this.codeShare = data.codeShare;
            }

            this.$nextTick((_) => {
              addCodeBtn();
            });
          },
          () => {
            this.loadingTable = false;
          }
      );
    },

    //首先该题必须支持开放测试点结果查看，同时若是比赛题目，只支持OI查看测试点情况，ACM强制禁止查看
    getAllCaseResult() {
      api.getAllCaseResult(this.$route.params.submitID).then((res) => {
        this.testCaseResult = res.data.data;
      });
    },

    shareSubmission(shared) {
      let data = {
        submitId: this.submission.submitId,
        share: shared,
        uid: this.submission.uid,
      };
      api.updateSubmission(data).then(
          (res) => {
            this.getSubmission();
            myMessage.success(this.$i18n.t('m.Shared_successfully'));
          },
          () => {
          }
      );
    },

    downloadSingleTestCase(item) {
      if(!this.downCaseAuthentication) {
        return
      }
      let problemID = item.pid
      let inputData = item.inputData
      let outputData = item.outputData
      let url = '/api/file/download-single-testcase?pid=' + problemID + '&inputData=' + inputData + '&outputData=' + outputData
      utils.downloadFile(url).then(() => {
        this.$alert(this.$i18n.t('m.Download_Testcase_Success'), 'Tips');
      });
    }
  },
  watch: {
    submission(newVal, oldVal) {
      if (newVal.code) {
        this.$nextTick((_) => {
          addCodeBtn();
        });
      }
    },
  },
  computed: {
    ...mapGetters([
      'isSuperAdmin',
      'isProblemAdmin'
    ]),
    status() {
      return {
        type: JUDGE_STATUS[this.submission.status].type,
        statusName: JUDGE_STATUS[this.submission.status].name,
        color: JUDGE_STATUS[this.submission.status].rgb,
      };
    },
    isCE() {
      return this.submission.status === JUDGE_STATUS_RESERVE.ce;
    },
    isSE() {
      return this.submission.status === JUDGE_STATUS_RESERVE.se;
    },
    isSF() {
      return this.submission.status === JUDGE_STATUS_RESERVE.sf;
    },
    isAdminRole() {
      return this.$store.getters.isAdminRole;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    isMySubmission() {
      return this.$store.getters.userInfo.uid === this.submission.uid;
    },
    downCaseAuthentication(){
      return this.isSuperAdmin || this.isProblemAdmin;
    }
  },
};
</script>

<style scoped>
#status .title {
  font-size: 20px;
}

#status .content {
  margin-top: 10px;
  font-size: 14px;
}

#status .content span {
  margin-right: 10px;
}

#status .span-row {
  display: block;
  float: left;
}

#status .content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
}

#share-btn {
  float: right;
  margin-top: 5px;
  margin-right: 10px;
}

#share-btn:nth-child(1) {
  margin-right: 0px;
}

.el-row--flex {
  flex-wrap: wrap;
}

.el-col {
  padding-left: 5px !important;
  padding-right: 5px !important;
}

.test-detail-item {
  width: 100%;
  padding: 5px;
  font-size: 14px;
  display: inline-block;
  vertical-align: top;
  border-radius: 3px;
  border: 1px solid #ff431e;
  border-left: 3px solid #ff431e;
  color: #ff431e;
  margin: 0 0 10px 0;
}

.test-detail-item h2 {
  font-weight: bolder;
  text-align: center;
  margin: 2px;
  padding: 0;
}

.test-detail-item > span {
  margin-right: 10px;
}

.test-run-static {
  text-align: center;
}

.test-detail-item.done {
  border-color: #25bb9b;
  color: #25bb9b;
}

@media screen and (min-width: 1050px) {
  /deep/ .vxe-table--body-wrapper {
    overflow-x: hidden !important;
  }
}
</style>
