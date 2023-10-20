<template>
  <div class="admin-container">
    <NavBar></NavBar>
    <div class="content-app">
      <transition mode="out-in" name="fadeInUp">
        <keep-alive :include="include">
          <router-view :key="$route.fullPath"/>
        </keep-alive>
      </transition>
      <div class="footer">
        <span style="margin-left:10px">
          <el-dropdown placement="top" @command="changeLanguage">
            <span class="el-dropdown-link" style="font-size:14px">
              <i aria-hidden="true" class="fa fa-globe">
                {{ this.webLanguage == 'zh-CN' ? '简体中文' : 'English' }}</i
              ><i class="el-icon-arrow-up el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
              <el-dropdown-item command="en-US">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import NavBar from "@/components/admin/NavBar.vue";
import {routeNameToComponentNameMap} from '@/router/index'

export default {
  name: 'home',
  components: {
    NavBar
  },
  data() {
    return {
      include: []
    };
  },
  methods: {
    changeLanguage(language) {
      this.$store.commit('changeWebLanguage', {language: language});
    },
  },
  computed: {
    ...mapGetters([
      'webLanguage',
    ]),
  },
  watch: {
    $route(to, from) {
      //如果 要 to(进入) 的页面是需要 keepAlive 缓存的，把 name push 进 include数组
      if (to.meta.keepAlive) {
        !this.include.includes(to.meta.componentName) && this.include.push(to.meta.componentName);
      }

      // 如果 要 from(离开) 的页面是 keepAlive缓存的
      if (from.meta.keepAlive && !from.meta.to.includes(to.name)) {
        let componentName = routeNameToComponentNameMap[from.name]
        let index = this.include.indexOf(componentName);
        index !== -1 && this.include.splice(index, 1);
      }
    }
  }
};
</script>

<style scoped>
a {
  background-color: transparent;
}

a:active,
a:hover {
  outline-width: 0;
}

img {
  border-style: none;
}

.admin-container {
  overflow: auto;
  font-weight: 400;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  background-color: #eff3f5;
  overflow-y: auto;
}

* {
  box-sizing: border-box;
}

.footer {
  margin: 15px;
  text-align: center;
  font-size: small;
}

@media screen and (min-width: 1150px) {
  .content-app {
    padding-top: 20px;
    padding-right: 10px;
    padding-left: 210px;
  }
}

@media screen and (max-width: 1150px) {
  .content-app {
    padding: 0 5px;
    margin-top: 20px;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(0, 30px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.fadeInUp-enter-active {
  animation: fadeInUp 0.8s;
}
</style>
