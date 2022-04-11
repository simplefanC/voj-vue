<template>
  <el-card shadow="always">
    <div slot="header">
      <span class="panel-title">{{ $t('m.Contest_Rejudge') }}</span>
    </div>
    <vxe-table
        :data="contestProblems"
        align="center"
        auto-resize
        border="inner"
        stripe
    >
      <vxe-table-column :title="$t('m.ID')" field="pid" width="60">
      </vxe-table-column>
      <vxe-table-column
          :title="$t('m.Problem_ID')"
          field="displayId"
          min-width="100"
      ></vxe-table-column>
      <vxe-table-column
          :title="$t('m.Title')"
          field="displayTitle"
          min-width="150"
          show-overflow
      >
      </vxe-table-column>
      <vxe-table-column :title="$t('m.AC')" field="ac" min-width="80">
      </vxe-table-column>
      <vxe-table-column
          :title="$t('m.Total')"
          field="total"
          min-width="80"
      ></vxe-table-column>
      <vxe-table-column :title="$t('m.Option')" field="option" min-width="150">
        <template v-slot="{ row }">
          <el-button
              :loading="btnLoading"
              icon="el-icon-refresh-right"
              round
              size="small"
              type="primary"
              @click="rejudgeProblem(row)"
          >{{ $t('m.Rejudge_All') }}
          </el-button
          >
        </template>
      </vxe-table-column>
    </vxe-table>
  </el-card>
</template>
<script>
import {mapActions, mapState} from 'vuex';
import api from '@/common/api';
import myMessage from '@/common/message';

export default {
  name: 'Contest-Rejudge-Admin',
  data() {
    return {
      btnLoading: false,
    };
  },
  mounted() {
    this.contestID = this.$route.params.contestID;
    if (this.contestProblems.length == 0) {
      this.getContestProblems();
    }
  },
  methods: {
    ...mapActions(['getContestProblems']),
    rejudgeProblem(row) {
      this.$confirm(this.$i18n.t('m.Contest_Rejudge_Tips'), 'Tips', {
        confirmButtonText: this.$i18n.t('m.OK'),
        cancelButtonText: this.$i18n.t('m.Cancel'),
        type: 'warning',
      }).then(
          () => {
            let params = {
              pid: row.pid,
              cid: row.cid,
            };
            this.btnLoading = true;
            api
                .ContestRejudgeProblem(params)
                .then((res) => {
                  myMessage.success(this.$i18n.t('m.Rejudge_successfully'));
                  this.btnLoading = false;
                })
                .catch(() => {
                  this.btnLoading = false;
                });
          },
          () => {
          }
      );
    },
  },
  computed: {
    ...mapState({
      contest: (state) => state.contest.contest,
      contestProblems: (state) => state.contest.contestProblems,
    }),
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
