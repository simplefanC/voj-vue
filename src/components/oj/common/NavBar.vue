<template>
  <div>
    <div v-if="!mobileNar" id="header">
      <el-menu
          :default-active="activeMenuName"
          active-text-color="#2196f3"
          mode="horizontal"
          router
          text-color="#495060"
      >
        <div class="logo">
          <el-image
              :src="imgUrl"
              fit="scale-down"
              style="width: 139px; height: 50px"
          ></el-image>
        </div>
        <el-menu-item index="/home"
        ><i class="el-icon-s-home"></i>{{ $t('m.NavBar_Home') }}
        </el-menu-item
        >
        <el-menu-item index="/problem" v-if="websiteConfig.problem"
        ><i class="el-icon-s-grid"></i
        >{{ $t('m.NavBar_Problem') }}
        </el-menu-item
        >
        <el-menu-item index="/training" v-if="websiteConfig.training"
        ><i class="el-icon-s-claim"></i
        >{{ $t('m.NavBar_Training') }}
        </el-menu-item
        >
        <el-menu-item index="/contest" v-if="websiteConfig.contest"
        ><i class="el-icon-trophy"></i
        >{{ $t('m.NavBar_Contest') }}
        </el-menu-item
        >
        <el-menu-item index="/status" v-if="websiteConfig.status"
        ><i class="el-icon-s-marketing"></i
        >{{ $t('m.NavBar_Status') }}
        </el-menu-item
        >
        <el-submenu index="rank" v-if="websiteConfig.rank">
          <template slot="title"
          ><i class="el-icon-s-data"></i>{{ $t('m.NavBar_Rank') }}
          </template
          >
          <el-menu-item index="/acm-rank">{{
              $t('m.NavBar_ACM_Rank')
            }}
          </el-menu-item>
          <el-menu-item index="/oi-rank">{{
              $t('m.NavBar_OI_Rank')
            }}
          </el-menu-item>
        </el-submenu>

        <el-menu-item index="/discussion" v-if="websiteConfig.discussion"
        ><i class="el-icon-s-comment"></i
        >{{ $t('m.NavBar_Discussion') }}
        </el-menu-item
        >

        <el-menu-item index="/introduction">
          <i class="el-icon-info"></i>
          {{ $t('m.NavBar_About') }}
        </el-menu-item>

        <!--        <el-submenu index="about">-->
        <!--          <template slot="title"-->
        <!--            ><i class="el-icon-info"></i>{{ $t('m.NavBar_About') }}</template-->
        <!--          >-->
        <!--          <el-menu-item index="/introduction">{{-->
        <!--            $t('m.NavBar_Introduction')-->
        <!--          }}</el-menu-item>-->
        <!--          <el-menu-item index="/developer">{{-->
        <!--            $t('m.NavBar_Developer')-->
        <!--          }}</el-menu-item>-->
        <!--        </el-submenu>-->

        <template v-if="!isAuthenticated">
          <div class="btn-menu">
            <el-button round type="primary" @click="handleBtnClick('Login')"
            >{{ $t('m.NavBar_Login') }}
            </el-button>
            <el-button
                v-if="websiteConfig.register"
                round
                style="margin-left: 5px"
                type="danger"
                @click="handleBtnClick('Register')"
            >{{ $t('m.NavBar_Register') }}
            </el-button>
          </div>
        </template>
        <template v-else>
          <el-dropdown
              class="drop-menu"
              placement="bottom"
              trigger="click"
              @command="handleRoute"
          >
            <span class="el-dropdown-link">
              {{ userInfo.username }}<i class="el-icon-caret-bottom"></i>
            </span>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/user-home">{{
                  $t('m.NavBar_UserHome')
                }}
              </el-dropdown-item>
              <el-dropdown-item command="/status?onlyMine=true">{{
                  $t('m.NavBar_Submissions')
                }}
              </el-dropdown-item>
              <el-dropdown-item command="/setting">{{
                  $t('m.NavBar_Setting')
                }}
              </el-dropdown-item>
              <el-dropdown-item v-if="isAdminRole" command="/admin">{{
                  $t('m.NavBar_Management')
                }}
              </el-dropdown-item>
              <el-dropdown-item command="/logout" divided>{{
                  $t('m.NavBar_Logout')
                }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <avatar
              :inline="true"
              :size="30"
              :src="avatar"
              :username="userInfo.username"
              class="drop-avatar"
              color="#FFF"
          ></avatar>
          <el-dropdown
              class="drop-msg"
              placement="bottom"
              @command="handleRoute"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-message-solid"></i>
              <svg
                  v-if="
                  unreadMessage.comment > 0 ||
                    unreadMessage.reply > 0 ||
                    unreadMessage.like > 0 ||
                    unreadMessage.sys > 0 ||
                    unreadMessage.mine > 0
                "
                  height="10"
                  style="vertical-align: top;margin-left: -11px;margin-top: 3px;"
                  width="10"
              >
                <circle cx="5" cy="5" r="5" style="fill: red;"></circle>
              </svg>
            </span>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/message/discuss">
                <span>{{ $t('m.DiscussMsg') }}</span>
                <span v-if="unreadMessage.comment > 0" class="drop-msg-count">
                  <MsgSvg :total="unreadMessage.comment"></MsgSvg>
                </span>
              </el-dropdown-item>
              <el-dropdown-item command="/message/reply">
                <span>{{ $t('m.ReplyMsg') }}</span>
                <span v-if="unreadMessage.reply > 0" class="drop-msg-count">
                  <MsgSvg :total="unreadMessage.reply"></MsgSvg>
                </span>
              </el-dropdown-item>
              <el-dropdown-item command="/message/like">
                <span>{{ $t('m.LikeMsg') }}</span>
                <span v-if="unreadMessage.like > 0" class="drop-msg-count">
                  <MsgSvg :total="unreadMessage.like"></MsgSvg>
                </span>
              </el-dropdown-item>
              <el-dropdown-item command="/message/sys">
                <span>{{ $t('m.SysMsg') }}</span>
                <span v-if="unreadMessage.sys > 0" class="drop-msg-count">
                  <MsgSvg :total="unreadMessage.sys"></MsgSvg>
                </span>
              </el-dropdown-item>
              <el-dropdown-item command="/message/mine">
                <span>{{ $t('m.MineMsg') }}</span>
                <span v-if="unreadMessage.mine > 0" class="drop-msg-count">
                  <MsgSvg :total="unreadMessage.mine"></MsgSvg>
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-menu>
    </div>

    <div v-else style="top:0px;left:0px;">
      <mu-appbar class="mobile-nav" color="primary">
        <mu-button slot="left" icon @click="opendrawer = !opendrawer">
          <i class="el-icon-s-unfold"></i>
        </mu-button>
        {{
          websiteConfig.shortName ? websiteConfig.shortName.toUpperCase() : 'OJ'
        }}
        <mu-button
            v-show="!isAuthenticated"
            slot="right"
            flat
            @click="handleBtnClick('Login')"
        >{{ $t('m.NavBar_Login') }}
        </mu-button
        >
        <mu-button
            v-show="!isAuthenticated && websiteConfig.register"
            slot="right"
            flat
            @click="handleBtnClick('Register')"
        >{{ $t('m.NavBar_Register') }}
        </mu-button
        >

        <mu-menu v-show="isAuthenticated" slot="right" :open.sync="openmsgmenu">
          <mu-button flat>
            <mu-icon size="24" value=":el-icon-message-solid"></mu-icon>
            <svg
                v-if="
                unreadMessage.comment > 0 ||
                  unreadMessage.reply > 0 ||
                  unreadMessage.like > 0 ||
                  unreadMessage.sys > 0 ||
                  unreadMessage.mine > 0
              "
                height="10"
                style="margin-left: -11px;margin-top: -13px;"
                width="10"
            >
              <circle cx="5" cy="5" r="5" style="fill: red;"></circle>
            </svg>
          </mu-button>
          <mu-list slot="content" @change="handleCommand">
            <mu-list-item button value="/message/discuss">
              <mu-list-item-content>
                <mu-list-item-title>
                  {{ $t('m.DiscussMsg') }}
                  <span v-if="unreadMessage.comment > 0" class="drop-msg-count">
                    <MsgSvg :total="unreadMessage.comment"></MsgSvg>
                  </span>
                </mu-list-item-title>
              </mu-list-item-content>
            </mu-list-item>
            <mu-divider></mu-divider>
            <mu-list-item button value="/message/reply">
              <mu-list-item-content>
                <mu-list-item-title>
                  {{ $t('m.ReplyMsg') }}
                  <span v-if="unreadMessage.reply > 0" class="drop-msg-count">
                    <MsgSvg :total="unreadMessage.reply"></MsgSvg>
                  </span>
                </mu-list-item-title>
              </mu-list-item-content>
            </mu-list-item>
            <mu-divider></mu-divider>
            <mu-list-item button value="/message/like">
              <mu-list-item-content>
                <mu-list-item-title>
                  {{ $t('m.LikeMsg') }}
                  <span v-if="unreadMessage.like > 0" class="drop-msg-count">
                    <MsgSvg :total="unreadMessage.like"></MsgSvg>
                  </span>
                </mu-list-item-title>
              </mu-list-item-content>
            </mu-list-item>
            <mu-divider></mu-divider>
            <mu-list-item button value="/message/sys">
              <mu-list-item-content>
                <mu-list-item-title>
                  {{ $t('m.SysMsg') }}
                  <span v-if="unreadMessage.sys > 0" class="drop-msg-count">
                    <MsgSvg :total="unreadMessage.sys"></MsgSvg>
                  </span>
                </mu-list-item-title>
              </mu-list-item-content>
            </mu-list-item>
            <mu-divider></mu-divider>

            <mu-list-item button value="/message/mine">
              <mu-list-item-content>
                <mu-list-item-title>
                  {{ $t('m.MineMsg') }}
                  <span v-if="unreadMessage.mine > 0" class="drop-msg-count">
                    <MsgSvg :total="unreadMessage.mine"></MsgSvg>
                  </span>
                </mu-list-item-title>
              </mu-list-item-content>
            </mu-list-item>
          </mu-list>
        </mu-menu>

        <mu-menu
            v-show="isAuthenticated"
            slot="right"
            :open.sync="openusermenu"
        >
          <mu-button flat>
            <avatar
                :inline="true"
                :size="30"
                :src="userInfo.avatar"
                :title="userInfo.username"
                :username="userInfo.username"
                color="#FFF"
            ></avatar>
            <i class="el-icon-caret-bottom"></i>
          </mu-button>
          <mu-list slot="content" @change="handleCommand">
            <mu-list-item button value="/user-home">
              <mu-list-item-content>
                <mu-list-item-title>{{
                    $t('m.NavBar_UserHome')
                  }}
                </mu-list-item-title>
              </mu-list-item-content>
            </mu-list-item>
            <mu-divider></mu-divider>
            <mu-list-item button value="/status?onlyMine=true">
              <mu-list-item-content>
                <mu-list-item-title>{{
                    $t('m.NavBar_Submissions')
                  }}
                </mu-list-item-title>
              </mu-list-item-content>
            </mu-list-item>
            <mu-divider></mu-divider>
            <mu-list-item button value="/setting">
              <mu-list-item-content>
                <mu-list-item-title>{{
                    $t('m.NavBar_Setting')
                  }}
                </mu-list-item-title>
              </mu-list-item-content>
            </mu-list-item>
            <mu-divider></mu-divider>
            <mu-list-item v-show="isAdminRole" button value="/admin">
              <mu-list-item-content>
                <mu-list-item-title>{{
                    $t('m.NavBar_Management')
                  }}
                </mu-list-item-title>
              </mu-list-item-content>
            </mu-list-item>
            <mu-divider></mu-divider>

            <mu-list-item button value="/logout">
              <mu-list-item-content>
                <mu-list-item-title>{{
                    $t('m.NavBar_Logout')
                  }}
                </mu-list-item-title>
              </mu-list-item-content>
            </mu-list-item>
          </mu-list>
        </mu-menu>
      </mu-appbar>

      <mu-appbar style="width: 100%;">
        <!--占位，刚好占领导航栏的高度-->
      </mu-appbar>

      <mu-drawer :docked="false" :open.sync="opendrawer" :right="false">
        <mu-list toggle-nested>
          <mu-list-item
              active-class="mobile-menu-active"
              button
              to="/home"
              @click="opendrawer = !opendrawer"
          >
            <mu-list-item-action>
              <mu-icon size="24" value="home"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>{{ $t('m.NavBar_Home') }}</mu-list-item-title>
          </mu-list-item>

          <mu-list-item
              active-class="mobile-menu-active"
              button
              to="/problem"
              @click="opendrawer = !opendrawer"
          >
            <mu-list-item-action>
              <mu-icon size="24" value=":el-icon-s-grid"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>{{
                $t('m.NavBar_Problem')
              }}
            </mu-list-item-title>
          </mu-list-item>

          <mu-list-item
              active-class="mobile-menu-active"
              button
              to="/training"
              @click="opendrawer = !opendrawer"
          >
            <mu-list-item-action>
              <mu-icon size="24" value=":el-icon-s-claim"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>{{
                $t('m.NavBar_Training')
              }}
            </mu-list-item-title>
          </mu-list-item>

          <mu-list-item
              active-class="mobile-menu-active"
              button
              to="/contest"
              @click="opendrawer = !opendrawer"
          >
            <mu-list-item-action>
              <mu-icon size="24" value=":el-icon-trophy"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>{{
                $t('m.NavBar_Contest')
              }}
            </mu-list-item-title>
          </mu-list-item>

          <mu-list-item
              active-class="mobile-menu-active"
              button
              to="/status"
              @click="opendrawer = !opendrawer"
          >
            <mu-list-item-action>
              <mu-icon size="24" value=":el-icon-s-marketing"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>{{ $t('m.NavBar_Status') }}</mu-list-item-title>
          </mu-list-item>

          <mu-list-item
              :open="openSideMenu === 'rank'"
              :ripple="false"
              button
              nested
              @toggle-nested="openSideMenu = arguments[0] ? 'rank' : ''"
          >
            <mu-list-item-action>
              <mu-icon size="24" value=":el-icon-s-data"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>{{ $t('m.NavBar_Rank') }}</mu-list-item-title>
            <mu-list-item-action>
              <mu-icon
                  class="toggle-icon"
                  size="24"
                  value="keyboard_arrow_down"
              ></mu-icon>
            </mu-list-item-action>
            <mu-list-item
                slot="nested"
                :ripple="false"
                active-class="mobile-menu-active"
                button
                to="/acm-rank"
                @click="opendrawer = !opendrawer"
            >
              <mu-list-item-title>{{
                  $t('m.NavBar_ACM_Rank')
                }}
              </mu-list-item-title>
            </mu-list-item>
            <mu-list-item
                slot="nested"
                :ripple="false"
                active-class="mobile-menu-active"
                button
                to="/oi-rank"
                @click="opendrawer = !opendrawer"
            >
              <mu-list-item-title>{{
                  $t('m.NavBar_OI_Rank')
                }}
              </mu-list-item-title>
            </mu-list-item>
          </mu-list-item>

          <mu-list-item
              active-class="mobile-menu-active"
              button
              to="/discussion"
              @click="opendrawer = !opendrawer"
          >
            <mu-list-item-action>
              <mu-icon size="24" value=":fa fa-comments"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>{{
                $t('m.NavBar_Discussion')
              }}
            </mu-list-item-title>
          </mu-list-item>

          <mu-list-item
              active-class="mobile-menu-active"
              button
              to="/introduction"
              @click="opendrawer = !opendrawer"
          >
            <mu-list-item-action>
              <mu-icon size="24" value=":el-icon-info"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>{{
                $t('m.NavBar_About')
              }}
            </mu-list-item-title>
          </mu-list-item>

          <!--          <mu-list-item-->
          <!--            button-->
          <!--            :ripple="false"-->
          <!--            nested-->
          <!--            :open="openSideMenu === 'about'"-->
          <!--            @toggle-nested="openSideMenu = arguments[0] ? 'about' : ''"-->
          <!--          >-->
          <!--            <mu-list-item-action>-->
          <!--              <mu-icon value=":el-icon-info" size="24"></mu-icon>-->
          <!--            </mu-list-item-action>-->
          <!--            <mu-list-item-title>{{ $t('m.NavBar_About') }}</mu-list-item-title>-->
          <!--            <mu-list-item-action>-->
          <!--              <mu-icon-->
          <!--                class="toggle-icon"-->
          <!--                size="24"-->
          <!--                value="keyboard_arrow_down"-->
          <!--              ></mu-icon>-->
          <!--            </mu-list-item-action>-->
          <!--            <mu-list-item-->
          <!--              button-->
          <!--              :ripple="false"-->
          <!--              slot="nested"-->
          <!--              to="/introduction"-->
          <!--              @click="opendrawer = !opendrawer"-->
          <!--              active-class="mobile-menu-active"-->
          <!--            >-->
          <!--              <mu-list-item-title>{{-->
          <!--                $t('m.NavBar_Introduction')-->
          <!--              }}</mu-list-item-title>-->
          <!--            </mu-list-item>-->
          <!--            <mu-list-item-->
          <!--              button-->
          <!--              :ripple="false"-->
          <!--              slot="nested"-->
          <!--              to="/developer"-->
          <!--              @click="opendrawer = !opendrawer"-->
          <!--              active-class="mobile-menu-active"-->
          <!--            >-->
          <!--              <mu-list-item-title>{{-->
          <!--                $t('m.NavBar_Developer')-->
          <!--              }}</mu-list-item-title>-->
          <!--            </mu-list-item>-->
          <!--          </mu-list-item>-->
        </mu-list>
      </mu-drawer>
    </div>
    <el-dialog
        :close-on-click-modal="false"
        :title="title"
        :visible.sync="modalVisible"
        class="dialog"
        width="370px"
    >
      <component :is="modalStatus.mode" v-if="modalVisible"></component>
      <div slot="footer" style="display: none"></div>
    </el-dialog>
  </div>
</template>
<script>
import Login from '@/components/oj/common/Login';
import Register from '@/components/oj/common/Register';
import ResetPwd from '@/components/oj/common/ResetPassword';
import MsgSvg from '@/components/oj/msg/msgSvg';
import {mapActions, mapGetters} from 'vuex';
import Avatar from 'vue-avatar';
import api from '@/common/api';

export default {
  components: {
    Login,
    Register,
    ResetPwd,
    Avatar,
    MsgSvg,
  },
  mounted() {
    window.onresize = () => {
      this.page_width();
    };
    this.page_width();
    if (this.isAuthenticated) {
      this.getUnreadMsgCount();
      this.msgTimer = setInterval(() => {
        this.getUnreadMsgCount();
      }, 120 * 1000);
    }
  },
  beforeDestroy() {
    clearInterval(this.msgTimer);
  },
  data() {
    return {
      centerDialogVisible: false,
      mobileNar: false,
      opendrawer: false,
      openusermenu: false,
      openmsgmenu: false,
      openSideMenu: '',
      imgUrl: require('@/assets/logo.png'),

      avatarStyle:
          'display: inline-flex;width: 30px;height: 30px;border-radius: 50%;align-items: center;justify-content: center;text-align: center;user-select: none;',
    };
  },
  methods: {
    ...mapActions(['changeModalStatus']),
    page_width() {
      let screenWidth = window.screen.width;
      if (screenWidth < 1050) {
        this.mobileNar = true;
      } else {
        this.mobileNar = false;
      }
    },
    handleBtnClick(mode) {
      this.changeModalStatus({
        mode,
        visible: true,
      });
    },
    handleRoute(route) {
      //电脑端导航栏路由跳转事件
      if (route && route.split('/')[1] != 'admin') {
        this.$router.push(route);
      } else {
        window.open('/admin/');
      }
    },
    handleCommand(route) {
      // 移动端导航栏路由跳转事件
      this.openusermenu = false;
      this.openmsgmenu = false;
      if (route && route.split('/')[1] != 'admin') {
        this.$router.push(route);
      } else {
        window.open('/admin/');
      }
    },
    getUnreadMsgCount() {
      api.getUnreadMsgCount().then((res) => {
        let data = res.data.data;
        this.$store.dispatch('updateUnreadMessageCount', data);
        let sumMsg =
            data.comment + data.reply + data.like + data.mine + data.sys;
        if (sumMsg > 0) {
          if (this.webLanguage == 'zh-CN') {
            this.$notify.info({
              title: '未读消息',
              message:
                  '亲爱的【' +
                  this.userInfo.username +
                  '】，您有最新的' +
                  sumMsg +
                  '条未读消息，请注意查看！',
              position: 'bottom-right',
              duration: 30000,
            });
          } else {
            this.$notify.info({
              title: 'Unread Message',
              message:
                  'Dear【' +
                  this.userInfo.username +
                  '】, you have the latest ' +
                  sumMsg +
                  ' unread messages. Please check them!',
              position: 'bottom-right',
              duration: 30000,
            });
          }
        }
      });
    },
  },
  computed: {
    ...mapGetters([
      'modalStatus',
      'userInfo',
      'isAuthenticated',
      'isAdminRole',
      'token',
      'websiteConfig',
      'unreadMessage',
      'webLanguage',
    ]),
    avatar() {
      return this.$store.getters.userInfo.avatar;
    },
    activeMenuName() {
      if (this.$route.path.split('/')[1] == 'submission-detail') {
        return '/status';
      } else if (this.$route.path.split('/')[1] == 'discussion-detail') {
        return '/discussion';
      }
      return '/' + this.$route.path.split('/')[1];
    },
    modalVisible: {
      get() {
        return this.modalStatus.visible;
      },
      set(value) {
        this.changeModalStatus({visible: value});
      },
    },
    title: {
      get() {
        let ojName = this.websiteConfig.shortName
            ? this.websiteConfig.shortName.toUpperCase()
            : 'OJ';
        if (this.modalStatus.mode == 'ResetPwd') {
          return this.$i18n.t('m.Dialog_Reset_Password') + ' - ' + ojName;
        } else {
          return (
              this.$i18n.t('m.Dialog_' + this.modalStatus.mode) + ' - ' + ojName
          );
        }
      },
    },
  },
  watch: {
    isAuthenticated() {
      if (this.isAuthenticated) {
        if (this.msgTimer) {
          clearInterval(this.msgTimer);
        }
        this.getUnreadMsgCount();
        this.msgTimer = setInterval(() => {
          this.getUnreadMsgCount();
        }, 120 * 1000);
      } else {
        clearInterval(this.msgTimer);
      }
    },
  },
};
</script>
<style scoped>
#header {
  min-width: 300px;
  position: fixed;
  top: 0;
  left: 0;
  height: auto;
  width: 100%;
  z-index: 2000;
  background-color: #fff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
}

.mobile-nav {
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 1800;
  height: auto;
  width: 100%;
}

#drawer {
  position: fixed;
  left: 0px;
  bottom: 0px;
  z-index: 1000;
  width: 100%;
  box-shadow: 00px 0px 00px rgb(255, 255, 255), 0px 0px 10px rgb(255, 255, 255),
  0px 0px 0px rgb(255, 255, 255), 1px 1px 0px rgb(218, 218, 218);
}

.logo {
  margin-left: 2%;
  /*margin-right: 2%;*/
  float: left;
  width: 139px;
  height: 42px;
  margin-top: 5px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff !important;
}

.el-icon-arrow-down {
  font-size: 18px;
}

.drop-menu {
  float: right;
  margin-right: 30px;
  position: relative;
  font-weight: 500;
  right: 10px;
  margin-top: 18px;
  font-size: 18px;
}

.drop-avatar {
  float: right;
  margin-right: 15px;
  position: relative;
  margin-top: 16px;
}

.drop-msg {
  float: right;
  font-size: 25px;
  margin-right: 10px;
  position: relative;
  margin-top: 13px;
}

.drop-msg-count {
  margin-left: 2px;
}

.btn-menu {
  font-size: 16px;
  float: right;
  margin-right: 10px;
  margin-top: 10px;
}

/deep/ .el-dialog {
  border-radius: 10px !important;
  text-align: center;
}

/deep/ .el-dialog__header .el-dialog__title {
  font-size: 22px;
  font-weight: 600;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1em;
  color: #4e4e4e;
}

.el-submenu__title i {
  color: #495060 !important;
}

.el-menu-item i {
  color: #495060;
}

.is-active .el-submenu__title i,
.is-active {
  color: #2196f3 !important;
}

.el-menu-item.is-active i {
  color: #2196f3 !important;
}

/*.logo {*/
/*  margin-left: 2%;*/
/*  margin-right: 2%;*/
/*  font-size: 20px;*/
/*  float: left;*/
/*  line-height: 60px;*/
/*}*/
</style>
