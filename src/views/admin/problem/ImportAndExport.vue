<template>
  <div>
    <el-card>
      <div slot="header">
        <span class="panel-title home-title">{{ $t('m.Export_Problem') }}</span>
        <div class="filter-row">
          <span>
            <el-button
                icon="el-icon-arrow-down"
                size="small"
                type="primary"
                @click="exportProblems"
            >{{ $t('m.Export') }}
            </el-button>
          </span>
          <span>
            <vxe-input
                v-model="keyword"
                :placeholder="$t('m.Enter_keyword')"
                size="medium"
                type="search"
                @keyup.enter.native="filterByKeyword"
                @search-click="filterByKeyword"
            ></vxe-input>
          </span>
        </div>
      </div>
      <vxe-table
          ref="xTable"
          :checkbox-config="{ labelField: '', highlight: true, range: true }"
          :data="problems"
          :loading="loadingProblems"
          auto-resize
          stripe
          @checkbox-change="handleSelectionChange"
          @checkbox-all="handlechangeAll"
      >
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column field="id" min-width="100" title="ID"></vxe-table-column>
        <vxe-table-column field="problemId" min-width="100" :title="$t('m.Display_ID')"></vxe-table-column>
        <vxe-table-column :title="$t('m.Title')" field="title" min-width="200">
        </vxe-table-column>
        <vxe-table-column
            :title="$t('m.Author')"
            field="author"
            min-width="100"
        >
        </vxe-table-column>

        <vxe-table-column :title="$t('m.Created_Time')" field="gmtCreate" min-width="100">
          <template v-slot="{ row }">
            {{ row.gmtCreate | localtime }}
          </template>
        </vxe-table-column>
      </vxe-table>

      <div class="panel-options">
        <el-pagination
            :page-size="limit"
            :total="total"
            class="page"
            layout="prev, pager, next"
            @current-change="getProblems"
        >
        </el-pagination>
      </div>
    </el-card>

    <el-card style="margin-top:15px">
      <div slot="header">
        <span class="panel-title home-title">{{ $t('m.Import_Problem') }}</span>
      </div>
      <el-upload
          ref="VOJ"
          :auto-upload="false"
          :file-list="fileList1"
          :limit="3"
          :on-change="onFile1Change"
          :on-error="uploadFailed"
          :on-success="uploadSucceeded"
          :show-file-list="true"
          :with-credentials="true"
          action="/api/file/import-problem"
          name="file"
      >
        <el-button
            slot="trigger"
            :loading="loading.VOJ"
            icon="el-icon-folder-opened"
            size="small"
            type="primary"
        >{{ $t('m.Choose_File') }}
        </el-button
        >
        <el-button
            :disabled="!fileList1.length"
            :loading="loading.VOJ"
            icon="el-icon-upload"
            size="small"
            style="margin-left: 10px;"
            type="success"
            @click="submitUpload('VOJ')"
        >{{ $t('m.Upload') }}
        </el-button
        >
      </el-upload>
    </el-card>

    <el-card style="margin-top:15px">
      <div slot="header">
        <span class="panel-title home-title">{{ $t('m.Import_LOJ_Problem') }}</span>
      </div>
      <el-form>
        <el-form-item :label="$t('m.Problem_ID')" required>
          <el-input v-model="LOJProblemId" type="number" size="small" style="width:200px"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
              :loading="addLOJProblemLoading"
              icon="el-icon-plus"
              type="primary"
              size="small"
              @click="addLOJProblem"
          >{{ $t('m.Add') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top:15px">
      <div slot="header">
        <span class="panel-title home-title">{{
            $t('m.Import_QDOJ_Problem')
          }}</span>
      </div>
      <el-upload
          ref="QDOJ"
          :auto-upload="false"
          :file-list="fileList2"
          :limit="3"
          :on-change="onFile2Change"
          :on-error="uploadFailed"
          :on-success="uploadSucceeded"
          :show-file-list="true"
          :with-credentials="true"
          action="/api/file/import-qdoj-problem"
          name="file"
      >
        <el-button
            slot="trigger"
            :loading="loading.QDOJ"
            icon="el-icon-folder-opened"
            size="small"
            type="primary"
        >{{ $t('m.Choose_File') }}
        </el-button
        >
        <el-button
            :disabled="!fileList2.length"
            :loading="loading.QDOJ"
            icon="el-icon-upload"
            size="small"
            style="margin-left: 10px;"
            type="success"
            @click="submitUpload('QDOJ')"
        >{{ $t('m.Upload') }}
        </el-button
        >
      </el-upload>
    </el-card>

    <el-card style="margin-top:15px">
      <div slot="header">
        <span class="panel-title home-title">{{
            $t('m.Import_FPS_Problem')
          }}</span>
      </div>
      <el-upload
          ref="FPS"
          :auto-upload="false"
          :file-list="fileList3"
          :limit="3"
          :on-change="onFile3Change"
          :on-error="uploadFailed"
          :on-success="uploadSucceeded"
          :show-file-list="true"
          :with-credentials="true"
          action="/api/file/import-fps-problem"
          name="file"
      >
        <el-button
            slot="trigger"
            :loading="loading.FPS"
            icon="el-icon-folder-opened"
            size="small"
            type="primary"
        >{{ $t('m.Choose_File') }}
        </el-button
        >
        <el-button
            :disabled="!fileList3.length"
            :loading="loading.FPS"
            icon="el-icon-upload"
            size="small"
            style="margin-left: 10px;"
            type="success"
            @click="submitUpload('FPS')"
        >{{ $t('m.Upload') }}
        </el-button
        >
      </el-upload>
    </el-card>
  </div>
</template>
<script>
import api from '@/common/api';
import utils from '@/common/utils';
import myMessage from '@/common/message';
import {REMOTE_OJ} from "@/common/constants";

export default {
  name: 'import_and_export',
  data() {
    return {
      fileList1: [],
      fileList2: [],
      fileList3: [],
      page: 1,
      limit: 10,
      total: 0,
      loadingProblems: false,
      loadingImporting: false,
      keyword: '',
      problems: [],
      selected_problems: [],
      loading: {
        VOJ: false,
        qdoj: false,
        fps: false,
      },
      addLOJProblemLoading: false,
      LOJProblemId: '',
    };
  },
  mounted() {
    this.getProblems();
  },
  methods: {
    // 题目表部分勾选 改变选中的内容
    handleSelectionChange({records}) {
      this.selected_problems = records;
    },

    // 一键全部选中，改变选中的内容列表
    handlechangeAll() {
      this.selected_problems = this.$refs.xTable.getCheckboxRecords();
    },
    // sleep(millisecond) {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve()
    //     }, millisecond)
    //   })
    // },
    // async addLOJProblem() {
    //   for (let i = 10029; i <= 10249; i++) {
    //     api.admin_addLOJProblem(i).then(
    //         (res) => {
    //         },
    //         (err) => {
    //           console.log(i)
    //         }
    //     );
    //     await this.sleep(9000);
    //   }
    // },
    addLOJProblem() {
      if (!this.LOJProblemId) {
        myMessage.error(this.$i18n.t('m.Problem_ID_is_required'));
        return;
      }
      this.addLOJProblemLoading = true;
      api.admin_addLOJProblem(this.LOJProblemId).then(
          (res) => {
            this.addLOJProblemLoading = false;
            myMessage.success(this.$i18n.t('m.Add_Successfully'));
            this.currentChange(1);
          },
          (err) => {
            this.addLOJProblemLoading = false;
          }
      );
    },

    getProblems(page = 1) {
      let params = {
        keyword: this.keyword,
        currentPage: page,
        limit: this.limit,
        oj: 'LOCAL',
      };
      this.loadingProblems = true;
      api.admin_getProblemList(params).then((res) => {
        this.problems = res.data.data.records;
        this.total = res.data.data.total;
        this.loadingProblems = false;
      });
    },
    exportProblems() {
      let params = [];
      if (this.selected_problems.length <= 0) {
        myMessage.error(this.$i18n.t('m.Export_Problem_NULL_Tips'));
        return;
      }
      for (let p of this.selected_problems) {
        params.push('pid=' + p.id);
      }
      let url = '/api/file/export-problem?' + params.join('&');
      utils.downloadFile(url);
    },
    submitUpload(ref) {
      this.loading[ref] = true;
      this.$refs[ref].submit();
    },
    onFile1Change(file, fileList) {
      this.fileList1 = fileList.slice(-1);
    },
    onFile2Change(file, fileList) {
      this.fileList2 = fileList.slice(-1);
    },
    onFile3Change(file, fileList) {
      this.fileList3 = fileList.slice(-1);
    },
    uploadSucceeded(response) {
      this.loading.VOJ = false;
      this.loading.QDOJ = false;
      this.loading.FPS = false;
      if (response.status != 200) {
        myMessage.error(response.msg);
      } else {
        myMessage.success(response.msg);
        this.getProblems();
      }
    },
    uploadFailed() {
      this.loading.VOJ = false;
      this.loading.QDOJ = false;
      this.loading.FPS = false;
      myMessage.error('Upload failed');
    },
    filterByKeyword() {
      this.getProblems();
    },
  },
};
</script>

<style scoped>
.filter-row {
  margin-top: 10px;
}

@media screen and (max-width: 768px) {
  .filter-row span {
    margin-right: 5px;
  }
}

@media screen and (min-width: 768px) {
  .filter-row span {
    margin-right: 20px;
  }
}
</style>
