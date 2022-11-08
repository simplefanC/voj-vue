<template>
  <div>
    <el-row :gutter="20">
      <el-col :lg="8" :md="10" :xs="24">
        <el-card class="admin-info">
          <div slot="header">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-image :src="userInfo.avatar" class="avatar" fit="fill">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-col>
              <el-col :span="14">
                <span class="panel-title admin-info-name">{{
                    userInfo.username
                  }}</span>
                <p>
                  {{
                    isSuperAdmin == true
                        ? $t('m.Super_Admin')
                        : isProblemAdmin == true
                            ? $t('m.All_Problem_Admin')
                            : $t('m.Admin')
                  }}
                </p>
              </el-col>
            </el-row>
          </div>
          <div class="last-info">
            <p class="last-info-title home-title">{{ $t('m.Last_Login') }}</p>
            <el-form class="last-info-body" label-width="80px">
              <el-form-item label="Time:">
                <span>{{ session.gmtCreate | localtime }}</span>
              </el-form-item>
              <el-form-item label="IP:">
                <span>{{ session.ip }}</span>
              </el-form-item>
              <el-form-item label="OS:">
                <span>{{ os }}</span>
              </el-form-item>
              <el-form-item label="Browser:">
                <span>{{ browser }}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <!-- <el-col :md="14" :lg="16" v-if="isSuperAdmin"> -->
      <el-col :lg="16" :md="14" :xs="24">
        <div class="info-container">
          <info-card
              :message="$t('m.Total_Users')"
              :value="infoData.userNum"
              class="info-item"
              color="#909399"
              icon="fa fa-users"
              iconSize="30px"
          ></info-card>
          <info-card
              :message="$t('m.Today_Submissions')"
              :value="infoData.todayJudgeNum"
              class="info-item"
              color="#67C23A"
              icon="fa fa-list"
          ></info-card>
          <info-card
              :message="$t('m.Recent_14_Days_Contests')"
              :value="infoData.recentContestNum"
              class="info-item"
              color="#409EFF"
              icon="fa fa-trophy"
          ></info-card>
        </div>
        <!-- <el-card title="System_Overview" v-if="isSuperAdmin"> -->
        <el-card>
          <div slot="header">
            <span class="panel-title home-title">{{
                $t('m.Backend_System')
              }}</span>
          </div>
          <el-row>
            <el-col :md="8" :xs="24">
              <span
              >{{ $t('m.Server_Number') }}：
                <el-tag color="#2d8cf0" effect="dark" size="mini">{{
                    generalInfo.backupService.length
                  }}</el-tag>
              </span>
            </el-col>
            <el-col :md="8" :xs="24">
              <span
              >{{ $t('m.Nacos_Status') }}：
                <el-tag
                    v-if="generalInfo.nacos.status == 'UP'"
                    color="#19be6b"
                    effect="dark"
                    size="mini"
                >{{ generalInfo.nacos.status }}</el-tag
                >
                <el-tag v-else color="#f90" effect="dark" size="mini">{{
                    generalInfo.nacos.status
                  }}</el-tag>
              </span>
            </el-col>
            <el-col :md="8" :xs="24">
              <span
              >{{ $t('m.HTTPS_Status') }}：
                <el-tag
                    :type="https ? 'success' : 'danger'"
                    effect="dark"
                    size="small"
                >
                  {{ https ? 'Enabled' : 'Disabled' }}
                </el-tag>
              </span>
            </el-col>
          </el-row>
          <h2 class="home-title">{{ $t('m.Backend_Service') }}</h2>
          <vxe-table
              :data="generalInfo.backupService"
              align="center"
              auto-resize
              stripe
          >
            <vxe-table-column :title="$t('m.Name')" min-width="130">
              <template v-slot="{ row }">
                <span>{{ row['serviceId'] }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column
                :title="$t('m.Host')"
                field="host"
                min-width="100"
            ></vxe-table-column>
            <vxe-table-column
                :title="$t('m.Port')"
                field="port"
                min-width="90"
            ></vxe-table-column>
            <vxe-table-column
                :title="$t('m.CPU_Core')"
                field="backupCores"
                min-width="90"
            >
            </vxe-table-column>

            <vxe-table-column
                :title="$t('m.CPU_Usage')"
                field="backupPercentCpuLoad"
                min-width="90"
            >
            </vxe-table-column>

            <vxe-table-column
                :title="$t('m.Mem_Usage')"
                field="backupPercentMemoryLoad"
                min-width="90"
            >
            </vxe-table-column>
            <vxe-table-column
                :title="$t('m.Secure')"
                field="secure"
                min-width="90"
            >
              <template v-slot="{ row }">
                <el-tooltip content="是否触发保护阈值" placement="top">
                  <el-tag v-if="row.secure" color="#ed3f14" effect="dark"
                  >True
                  </el-tag
                  >
                  <el-tag v-else color="#2d8cf0" effect="dark">False</el-tag>
                </el-tooltip>
              </template>
            </vxe-table-column>
            <vxe-table-column :title="$t('m.Healthy_Status')" min-width="90">
              <template v-slot="{ row }">
                <el-tag
                    v-if="row.metadata['nacos.healthy'] == 'true'"
                    color="#19be6b"
                    effect="dark"
                >{{ $t('m.Healthy') }}
                </el-tag
                >
                <el-tag v-else color="#f90" effect="dark">{{
                    $t('m.Unhealthy')
                  }}
                </el-tag>
              </template>
            </vxe-table-column>
          </vxe-table>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top:10px">
      <div slot="header">
        <span class="panel-title home-title">{{ $t('m.Judge_Server') }}</span>
      </div>
      <vxe-table :data="judgeInfo" align="center" auto-resize stripe>
        <vxe-table-column type="seq" width="50"></vxe-table-column>
        <vxe-table-column :title="$t('m.Name')" min-width="120">
          <template v-slot="{ row }">
            <span>{{ row.service.metadata.judgeName }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column :title="$t('m.Host')" min-width="100">
          <template v-slot="{ row }">
            <span>{{ row.service.host }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column :title="$t('m.Port')" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.service.port }}</span>
          </template>
        </vxe-table-column>

        <vxe-table-column
            :title="$t('m.CPU_Core')"
            field="cpuCores"
            min-width="80"
        >
        </vxe-table-column>

        <vxe-table-column
            :title="$t('m.CPU_Usage')"
            field="percentCpuLoad"
            min-width="100"
        >
        </vxe-table-column>

        <vxe-table-column
            :title="$t('m.Mem_Usage')"
            field="percentMemoryLoad"
            min-width="110"
        >
        </vxe-table-column>

        <vxe-table-column :title="$t('m.Secure')" min-width="80">
          <template v-slot="{ row }">
            <el-tooltip content="是否触发保护阈值" placement="top">
              <el-tag v-if="row.service.secure" color="#ed3f14" effect="dark"
              >True
              </el-tag
              >
              <el-tag v-else color="#2d8cf0" effect="dark">False</el-tag>
            </el-tooltip>
          </template>
        </vxe-table-column>
        <vxe-table-column :title="$t('m.Healthy_Status')" min-width="100">
          <template v-slot="{ row }">
            <el-tag
                v-if="row.service.metadata['nacos.healthy'] == 'true'"
                color="#19be6b"
                effect="dark"
            >{{ $t('m.Healthy') }}
            </el-tag
            >
            <el-tag v-else color="#f90" effect="dark">{{
                $t('m.Unhealthy')
              }}
            </el-tag>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import browserDetector from 'browser-detect';
import api from '@/common/api';

const InfoCard = () => import('@/components/admin/infoCard.vue');

export default {
  name: 'dashboard',
  components: {
    InfoCard,
  },
  data() {
    return {
      infoData: {
        userNum: 0,
        recentContestNum: 0,
        todayJudgeNum: 0,
      },
      generalInfo: {
        backupCores: 0,
        backupPercentCpuLoad: '0%',
        backupPercentMemoryLoad: '0%',
        backupService: [],
        nacos: {},
      },
      judgeInfo: [],
      session: {},
    };
  },
  mounted() {
    this.refreshJudgeServerList();
    this.refreshGeneralSystemInfo();
    // 每5秒刷新判题机服务和后台服务的情况
    this.intervalId = setInterval(() => {
      this.refreshJudgeServerList();
      this.refreshGeneralSystemInfo();
    }, 5000);
    api.admin_getDashboardInfo().then(
        (resp) => {
          this.infoData = resp.data.data;
        },
        () => {
        }
    );

    api.getSessions(this.userInfo.uid).then(
        (resp) => {
          this.session = resp.data.data;
        },
        () => {
        }
    );
  },
  methods: {
    refreshJudgeServerList() {
      api.getJudgeServer().then(
          (res) => {
            this.judgeInfo = res.data.data;
          },
          (err) => {
            clearInterval(this.intervalId);
          }
      );
    },
    refreshGeneralSystemInfo() {
      api.admin_getGeneralSystemInfo().then(
          (res) => {
            this.generalInfo = res.data.data;
            this.generalInfo.backupService[0][
                'backupCores'
                ] = this.generalInfo.backupCores;
            this.generalInfo.backupService[0][
                'backupPercentCpuLoad'
                ] = this.generalInfo.backupPercentCpuLoad;
            this.generalInfo.backupService[0][
                'backupPercentMemoryLoad'
                ] = this.generalInfo.backupPercentMemoryLoad;
          },
          () => {
            clearInterval(this.intervalId);
          }
      );
    },
  },
  computed: {
    ...mapGetters(['userInfo', 'isSuperAdmin', 'isProblemAdmin']),
    https() {
      return document.URL.slice(0, 5) === 'https';
    },
    browser() {
      let b = browserDetector(this.session.userAgent);
      if (b.name && b.version) {
        return b.name + ' ' + b.version;
      } else {
        return 'Unknown';
      }
    },
    os() {
      let b = browserDetector(this.session.userAgent);
      return b.os ? b.os : 'Unknown';
    },
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.intervalId);
    next();
  },
};
</script>

<style scoped>
.admin-info {
  margin-bottom: 20px;
}

.admin-info-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #409eff;
}

.admin-info .avatar {
  max-width: 100%;
  max-width: 100px;
  max-height: 100px;
}

.admin-info .last-info-title {
  font-size: 16px;
}

.el-form-item {
  margin-bottom: 5px;
}

.info-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.info-container .info-item {
  flex: 1 0 auto;
  min-width: 200px;
  margin-bottom: 10px;
}

/deep/ .el-tag--dark {
  border-color: #fff;
}

/deep/ .el-card__header {
  padding-bottom: 0;
}

@media screen and (min-width: 1150px) {
  /deep/ .vxe-table--body-wrapper {
    overflow-x: hidden !important;
  }
}
</style>
