<template>
  <div>
    <el-alert
        :closable="false"
        center
        class="msg-title"
        effect="dark"
        type="success"
    >
      <template slot="title">
        <span
        ><i class="el-icon-s-promotion">
            {{ $t('m.Message_Center') }}</i
        ></span
        >
      </template>
    </el-alert>
    <el-tabs
        v-model="route_name"
        style="min-height: 500px;"
        tab-position="left"
        type="border-card"
        @tab-click="handleRouter"
    >
      <el-tab-pane name="DiscussMsg">
        <span slot="label">
          <span>{{ $t('m.DiscussMsg') }}</span>
          <span v-if="unreadMessage.comment > 0" style=" margin-left: 2px;">
            <MsgSvg :total="unreadMessage.comment"></MsgSvg>
          </span>
        </span>
        <transition mode="out-in" name="fadeInUp">
          <router-view v-if="route_name === 'DiscussMsg'"></router-view>
        </transition>
      </el-tab-pane>
      <el-tab-pane name="ReplyMsg">
        <span slot="label">
          <span>{{ $t('m.ReplyMsg') }}</span>
          <span v-if="unreadMessage.reply > 0" style=" margin-left: 2px;">
            <MsgSvg :total="unreadMessage.reply"></MsgSvg>
          </span>
        </span>
        <transition mode="out-in" name="fadeInUp">
          <router-view v-if="route_name === 'ReplyMsg'"></router-view>
        </transition>
      </el-tab-pane>
      <el-tab-pane name="LikeMsg">
        <span slot="label">
          <span>{{ $t('m.LikeMsg') }}</span>
          <span v-if="unreadMessage.like > 0" style=" margin-left: 2px;">
            <MsgSvg :total="unreadMessage.like"></MsgSvg>
          </span>
        </span>
        <transition mode="out-in" name="fadeInUp">
          <router-view v-if="route_name === 'LikeMsg'"></router-view>
        </transition>
      </el-tab-pane>
      <el-tab-pane name="SysMsg">
        <span slot="label">
          <span>{{ $t('m.SysMsg') }}</span>
          <span v-if="unreadMessage.sys > 0" style=" margin-left: 2px;">
            <MsgSvg :total="unreadMessage.sys"></MsgSvg>
          </span>
        </span>
        <transition mode="out-in" name="fadeInUp">
          <router-view v-if="route_name === 'SysMsg'"></router-view>
        </transition>
      </el-tab-pane>
      <el-tab-pane name="MineMsg">
        <span slot="label">
          <span>{{ $t('m.MineMsg') }}</span>
          <span v-if="unreadMessage.mine > 0" style=" margin-left: 2px;">
            <MsgSvg :total="unreadMessage.mine"></MsgSvg>
          </span>
        </span>
        <transition mode="out-in" name="fadeInUp">
          <router-view v-if="route_name === 'MineMsg'"></router-view>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import MsgSvg from '@/components/oj/msg/msgSvg';

export default {
  components: {
    MsgSvg,
  },
  data() {
    return {
      route_name: 'DiscussMsg',
    };
  },
  mounted() {
    this.route_name = this.$route.name;
    if (this.route_name === 'Message') {
      this.route_name = 'DiscussMsg';
    }
    this.$router.push({name: this.route_name});
  },
  methods: {
    handleRouter(tab) {
      let name = tab.name;
      if (name !== this.$route.name) {
        this.$router.push({name: name});
      }
    },
  },
  computed: {
    ...mapGetters(['unreadMessage']),
  },
};
</script>

<style scoped>
.msg-title {
  background-image: linear-gradient(135deg, #2afadf 10%, #4c83ff 100%);
}

/deep/ .el-alert__title {
  font-size: 18px !important;
  line-height: 18px !important;
}

/deep/ .el-tabs__item {
  text-align: center !important;
}

/deep/ .el-tabs__item {
  padding: 0 40px;
  line-height: 53px;
  height: 53px;
  font-weight: 700;
}

/deep/ .el-card__body {
  padding: 15px;
  padding-bottom: 10px;
}

@media only screen and (max-width: 767px) {
  /deep/ .el-tabs__item {
    padding: 0 10px;
  }

  /deep/ .el-tabs__content {
    padding: 12px;
    padding-left: 0px !important;
  }
}
</style>
