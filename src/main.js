import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Element from 'element-ui'
import i18n from '@/i18n'
import router from './router'

import "element-ui/lib/theme-chalk/index.css"
import 'font-awesome/css/font-awesome.min.css'
import Message from 'vue-m-message'
import 'vue-m-message/dist/index.css'
import axios from 'axios'

// 注释表示使用cdn引入
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

// markdown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css';
// https://github.com/LIRUILONGS/Vue-markdown-katex
import Md_Katex from '@iktakahiro/markdown-it-katex'
import Katex from '@/common/katex'

import VueClipboard from 'vue-clipboard2'

import highlight from '@/common/highlight'

import filters from '@/common/filters.js'
import VueCropper from 'vue-cropper'

import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markPoint'
// 使用CDN的方式如下引入echarts
import VueECharts from 'vue-echarts';
import VueParticles from 'vue-particles'
import SlideVerify from 'vue-monoplasty-slide-verify'

import {AppBar, Button, Divider, Drawer, Icon, List, Menu} from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';

import VueDOMPurifyHTML from 'vue-dompurify-html'

Vue.component('ECharts', ECharts)

Vue.component('ECharts', VueECharts)

Vue.use(mavonEditor)

Vue.use(VueDOMPurifyHTML)

Vue.use(Drawer)
Vue.use(List)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(AppBar)
Vue.use(Button)
Vue.use(Divider)

Object.keys(filters).forEach(key => {   // 注册全局过滤器
  Vue.filter(key, filters[key])
})
Vue.use(VueParticles) // 粒子特效背景
Vue.use(Katex)  // 数学公式渲染
VXETable.setup({
  // 对组件内置的提示语进行国际化翻译
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(VXETable) // 表格组件
Vue.use(VueClipboard) // 剪贴板
Vue.use(highlight) // 代码高亮
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(VueCropper) // 图像剪切
Vue.use(Message, {name: 'msg'}) // `Vue.prototype.$msg` 全局消息提示

Vue.use(SlideVerify) // 滑动验证码组件

Vue.prototype.$axios = axios

Vue.prototype.$markDown = mavonEditor.mavonEditor.getMarkdownIt().use(Md_Katex)  // 挂载到vue

Vue.config.productionTip = false
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
