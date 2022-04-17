import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/user'
import contest from "@/store/contest"
import training from "@/store/training"
import api from '@/common/api'
import i18n from '@/i18n'
import storage from '@/common/storage'
import moment from 'moment'

Vue.use(Vuex)
const rootState = {
  modalStatus: {
    mode: 'Login', // or 'register',
    visible: false
  },
  websiteConfig: {
    recordName: '© 2020-2021',
    projectName: 'VOJ',
    shortName: 'OJ',
    recordUrl: '#',
    projectUrl: '#',
    problem: true,
    training: true,
    contest: true,
    status: true,
    rank: true,
    discussion: true,
    introduction: true
  },
  registerTimeOut: 60,
  resetTimeOut: 90,
  language: storage.get('Web_Language') || 'zh-CN',
}

const rootGetters = {
  'modalStatus'(state) {
    return state.modalStatus
  },
  'registerTimeOut'(state) {
    return state.registerTimeOut
  },
  'resetTimeOut'(state) {
    return state.resetTimeOut
  },
  'websiteConfig'(state) {
    return state.websiteConfig
  },
  'webLanguage'(state) {
    return state.language
  }
}

const rootMutations = {
  changeModalStatus(state, {mode, visible}) {
    if (mode !== undefined) {
      state.modalStatus.mode = mode
    }
    if (visible !== undefined) {
      state.modalStatus.visible = visible
    }
  },
  changeRegisterTimeOut(state, {time}) {
    if (time !== undefined) {
      state.registerTimeOut = time
    }
  },
  changeResetTimeOut(state, {time}) {
    if (time !== undefined) {
      state.resetTimeOut = time
    }
  },
  startTimeOut(state, {name}) { // 注册邮件和重置邮件倒计时
    if (state.resetTimeOut == 0) {
      state.resetTimeOut = 90
      return;
    }
    if (state.registerTimeOut == 0) {
      state.registerTimeOut = 60
      return;
    }
    if (name == 'resetTimeOut') {
      state.resetTimeOut--;
    }
    if (name == 'registerTimeOut') {
      state.registerTimeOut--;
    }
    setTimeout(() => {
      this.commit('startTimeOut', {name: name})
    }, 1000);
  },
  changeWebsiteConfig(state, payload) {
    state.websiteConfig = payload.websiteConfig
  },
  changeWebLanguage(state, {language}) {
    if (language) {
      state.language = language
      i18n.locale = language
      moment.locale(language);
    }
    storage.set('Web_Language', language)
  }
}
const rootActions = {
  changeModalStatus({commit}, payload) {
    commit('changeModalStatus', payload)
  },
  changeResetTimeOut({commit}, payload) {
    commit('changeResetTimeOut', payload)
  },
  changeRegisterTimeOut({commit}, payload) {
    commit('changeRegisterTimeOut', payload)
  },
  startTimeOut({commit}, payload) {
    commit('startTimeOut', payload)
  },
  changeDomTitle({commit, state}, payload) {
    if (payload && payload.title) {
      window.document.title = payload.title + ' - ' + (state.websiteConfig.shortName + '').toUpperCase()
    } else {
      window.document.title = state.route.meta.title + ' - ' + (state.websiteConfig.shortName + '').toUpperCase()
    }
  },
  getWebsiteConfig({commit}) {
    api.getWebsiteConfig().then(res => {
      commit('changeWebsiteConfig', {
        websiteConfig: res.data.data
      })
    })
  },
}

export default new Vuex.Store({
  modules: {
    user,
    contest,
    training
  },
  state: rootState,
  getters: rootGetters,
  mutations: rootMutations,
  actions: rootActions,
})
