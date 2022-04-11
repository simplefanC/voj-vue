<template>
  <div class="problem-list">
    <vxe-table
        :data="problemList"
        align="center"
        auto-resize
        border="inner"
        highlight-hover-row
        stripe
        @cell-click="goTrainingProblem"
    >
      <vxe-table-column
          v-if="isAuthenticated"
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
              <template v-if="row.myStatus == 0">
                <i
                    :style="getIconColor(row.myStatus)"
                    class="el-icon-check"
                ></i>
              </template>

              <template v-else-if="row.myStatus != -10">
                <i
                    :style="getIconColor(row.myStatus)"
                    class="el-icon-minus"
                ></i>
              </template>
            </el-tooltip>
          </template>
        </template>
      </vxe-table-column>
      <vxe-table-column
          :title="$t('m.Problem_ID')"
          field="problemId"
          show-overflow
          width="150"
      >
      </vxe-table-column>
      <vxe-table-column
          :title="$t('m.Title')"
          field="title"
          min-width="150"
          show-overflow
      ></vxe-table-column>

      <vxe-table-column
          :title="$t('m.Level')"
          field="difficulty"
          min-width="100"
      >
        <template v-slot="{ row }">
          <span
              :style="getLevelColor(row.difficulty)"
              class="el-tag el-tag--small"
          >{{ getLevelName(row.difficulty) }}</span
          >
        </template>
      </vxe-table-column>

      <vxe-table-column field="tag" min-width="100">
        <template v-slot:header
        >
          <el-link
              v-if="!showTags"
              :underline="false"
              type="primary"
              @click="showTags = !showTags"
          >{{ $t('m.Show_Tags') }}
          </el-link
          >
          <el-link
              v-else
              :underline="false"
              type="danger"
              @click="showTags = !showTags"
          >{{ $t('m.Hide_Tags') }}
          </el-link
          >
        </template>
        <template v-slot="{ row }">
          <div v-if="showTags">
            <span
                v-for="tag in row.tags"
                :key="tag.id"
                :style="
                'margin-right:7px;color:#FFF;background-color:' +
                  (tag.color ? tag.color : '#409eff')
              "
                class="el-tag el-tag--small"
            >{{ tag.name }}</span
            >
          </div>
        </template>
      </vxe-table-column>

      <vxe-table-column :title="$t('m.AC_Rate')" field="ac" min-width="120">
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
import utils from '@/common/utils';
import {JUDGE_STATUS} from '@/common/constants';
import api from '@/common/api';

export default {
  name: 'TrainingProblemList',
  data() {
    return {
      JUDGE_STATUS: {},
      isGetStatusOk: false,
      testcolor: 'rgba(0, 206, 209, 1)',
      showTags: false,
    };
  },
  mounted() {
    this.JUDGE_STATUS = Object.assign({}, JUDGE_STATUS);
    this.getTrainingProblemList();
  },
  methods: {
    getTrainingProblemList() {
      this.$store.dispatch('getTrainingProblemList').then((res) => {
        if (this.isAuthenticated) {
          // 如果已登录，则需要查询对当前页面题目列表中各个题目的提交情况
          let pidList = [];
          if (this.problemList && this.problemList.length > 0) {
            for (let index = 0; index < this.problemList.length; index++) {
              pidList.push(this.problemList[index].pid);
            }
            api.getUserProblemStatus(pidList, false).then((res) => {
              let result = res.data.data;
              for (let index = 0; index < this.problemList.length; index++) {
                this.problemList[index]['myStatus'] =
                    result[this.problemList[index].pid]['status'];
              }
              this.isGetStatusOk = true;
            });
          }
        }
      });
    },
    goTrainingProblem(event) {
      this.$router.push({
        name: 'TrainingProblemDetails',
        params: {
          trainingID: this.$route.params.trainingID,
          problemID: event.row.problemId,
        },
      });
    },
    getACRate(ACCount, TotalCount) {
      return utils.getACRate(ACCount, TotalCount);
    },
    getIconColor(status) {
      return (
          'font-weight: 600;font-size: 16px;color:' + JUDGE_STATUS[status].rgb
      );
    },
    getLevelColor(difficulty) {
      return utils.getLevelColor(difficulty);
    },
    getLevelName(difficulty) {
      return utils.getLevelName(difficulty);
    },
    getPassingRate(ac, total) {
      if (!total) {
        return 0;
      }
      return ((ac / total) * 100).toFixed(2);
    },
  },
  computed: {
    ...mapState({
      problemList: (state) => state.training.trainingProblemList,
    }),
    ...mapGetters(['isAuthenticated']),
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
