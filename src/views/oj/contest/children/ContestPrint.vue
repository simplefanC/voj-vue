<template>
  <el-card shadow="always">
    <div slot="header">
      <span class="panel-title">{{ $t('m.Print') }}</span>
    </div>
    <div class="print-tips">
      <el-alert
          :closable="false"
          :description="$t('m.Print_tips')"
          :title="$t('m.Print_Title')"
          center
          show-icon
          type="warning"
      >
      </el-alert>
    </div>
    <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm"
        label-width="100px"
    >
      <el-form-item :label="$t('m.Content')" prop="content">
        <el-input
            v-model="ruleForm.content"
            :rows="20"
            type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="primary" @click="onSubmit">{{
            $t('m.Submit')
          }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import mMessage from '@/common/message';
import api from '@/common/api';

export default {
  data() {
    return {
      ruleForm: {
        content: '',
      },
      rules: {
        content: [{required: true, trigger: 'blur'}],
      },
      contestID: null,
    };
  },
  mounted() {
    this.contestID = this.$route.params.contestID;
  },
  methods: {
    onSubmit() {
      if (!this.ruleForm.content) {
        mMessage.error(this.$i18n.t('m.Content_cannot_be_empty'));
        return;
      }
      if (this.ruleForm.content.length < 50) {
        mMessage.error(
            this.$i18n.t('m.The_number_of_content_cannot_be_less_than_50')
        );
        return;
      }
      let data = {
        cid: this.contestID,
        content: this.ruleForm.content,
      };
      api.submitPrintText(data).then((res) => {
        this.$confirm(
            this.$i18n.t('m.Success_submit_tips'),
            this.$i18n.t('m.Submit_code_successfully'),
            {
              type: 'success',
              center: true,
              confirmButtonText: this.$i18n.t('m.OK'),
            }
        );
      });
    },
  },
};
</script>

<style scoped>
.print-tips {
  margin-left: 50px;
  padding: 30px;
  padding-top: 0px;
}
</style>
