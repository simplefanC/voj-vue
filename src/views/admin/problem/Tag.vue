<template>
  <div>
    <el-card>
      <div slot="header">
        <span class="panel-title home-title">{{ $t('m.Admin_Tag') }}</span>
        <div class="filter">
          <span>
            <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="openTagDialog('add', null)"
            >{{ $t('m.Add_Tag') }}
            </el-button>
          </span>
          <span>
            <el-select
                v-model="tagOj"
                size="small"
                style="width: 150px;"
                @change="getProblemTagList"
            >
              <el-option
                  :label="$t('m.All_Problem')"
                  :value="'ALL'"
              ></el-option>
              <el-option :label="$t('m.My_OJ')" :value="'LOCAL'"></el-option>
              <el-option
                  v-for="(remoteOj, index) in REMOTE_OJ"
                  :key="index"
                  :label="remoteOj.name"
                  :value="remoteOj.key"
              ></el-option>
            </el-select>
          </span>
        </div>
      </div>

      <el-tag
          v-for="(tag, index) in tagList"
          :key="index"
          :color="tag.color ? tag.color : '#409eff'"
          :disable-transitions="false"
          class="tag"
          closable
          effect="dark"
          @click="openTagDialog('update', tag)"
          @close="deleteTag(tag)"
      >
        {{ tag.name }}
      </el-tag>

      <el-button
          class="button-new-tag"
          size="small"
          @click="openTagDialog('add', null)"
      >+ New Tag
      </el-button
      >
    </el-card>

    <el-dialog
        :title="$t('m.' + upsertTitle)"
        :visible.sync="addTagDialogVisible"
        width="350px"
        @close-on-click-modal="false"
    >
      <el-form>
        <el-form-item :label="$t('m.Tag_Name')" required>
          <el-input v-model="tag.name" size="small"></el-input>
        </el-form-item>
        <el-form-item :label="$t('m.Tag_Color')" required>
          <el-color-picker v-model="tag.color"></el-color-picker>
        </el-form-item>

        <el-form-item :label="$t('m.Tag_Attribution')" required="">
          <el-select v-model="tag.oj" size="small" style="width: 150px;">
            <el-option :label="$t('m.My_OJ')" :value="'LOCAL'"></el-option>
            <el-option
                v-for="(remoteOj, index) in REMOTE_OJ"
                :key="index"
                :label="remoteOj.name"
                :value="remoteOj.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="text-align:center">
          <el-button
              :loading="upsertTagLoading"
              type="primary"
              @click="upsertTag"
          >{{ $t('m.' + upsertTagBtn) }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import myMessage from '@/common/message';
import api from '@/common/api';
import {REMOTE_OJ} from '@/common/constants';

export default {
  data() {
    return {
      tagOj: 'LOCAL',
      REMOTE_OJ: {},
      getTagListLoading: false,
      tagList: [],
      addTagDialogVisible: false,
      upsertTitle: 'Add_Tag',
      upsertTagBtn: 'To_Add',
      upsertTagLoading: false,
      tag: {
        id: null,
        name: null,
        color: null,
        oj: 'LOCAL',
      },
    };
  },
  mounted() {
    this.REMOTE_OJ = Object.assign({}, REMOTE_OJ);
    this.getProblemTagList();
  },
  methods: {
    getProblemTagList() {
      this.getTagListLoading = true;
      api.getProblemTagList(this.tagOj).then(
          (res) => {
            this.tagList = res.data.data;
            this.getTagListLoading = false;
          },
          (err) => {
            this.getTagListLoading = false;
          }
      );
    },

    deleteTag(tag) {
      this.$confirm(this.$i18n.t('m.Delete_Tag_Tips'), 'Tips', {
        type: 'warning',
      }).then(
          () => {
            api
                .admin_deleteTag(tag.id)
                .then((res) => {
                  myMessage.success(this.$i18n.t('m.Delete_successfully'));
                  this.tagList.splice(this.tagList.indexOf(tag), 1);
                })
                .catch(() => {
                });
          },
          () => {
          }
      );
    },
    openTagDialog(action, tag) {
      if (action == 'add') {
        this.upsertTitle = 'Add_Tag';
        this.upsertTagBtn = 'To_Add';
        this.tag = {
          id: null,
          name: null,
          color: null,
          oj: this.tagOj,
        };
      } else {
        this.upsertTitle = 'Update_Tag';
        this.upsertTagBtn = 'To_Update';
        this.tag = Object.assign({}, tag);
      }
      this.addTagDialogVisible = true;
    },

    upsertTag() {
      if (this.tag.id) {
        this.upsertTagLoading = true;
        api.admin_updateTag(this.tag).then(
            (res) => {
              this.upsertTagLoading = false;
              myMessage.success(this.$i18n.t('m.Update_Successfully'));
              this.tagList.push(res.data.data);
              this.addTagDialogVisible = false;
              this.getProblemTagList();
            },
            (err) => {
              this.upsertTagLoading = false;
            }
        );
      } else {
        this.upsertTagLoading = true;
        api.admin_addTag(this.tag).then(
            (res) => {
              this.upsertTagLoading = false;
              myMessage.success(this.$i18n.t('m.Add_Successfully'));
              this.tagList.push(res.data.data);
              this.addTagDialogVisible = false;
            },
            (err) => {
              this.upsertTagLoading = false;
            }
        );
      }
    },
  },
};
</script>
<style scoped>
.filter {
  margin-top: 10px;
}

.filter span {
  margin-right: 10px;
}

.el-tag {
  margin-left: 10px;
  margin-top: 10px;
}

.tag {
  cursor: pointer;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 10px;
}
</style>
