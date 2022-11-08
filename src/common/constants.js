export const JUDGE_STATUS = {
  '-10': {
    name: 'Not Submitted',
    short: 'NS',
    color: 'gray',
    type: 'info',
    rgb: '#909399'
  },
  '-5': {
    name: 'Submitted Unknown Result',
    short: 'SNR',
    color: 'gray',
    type: 'info',
    rgb: '#909399'
  },
  '-3': {
    name: 'Presentation Error',
    short: 'PE',
    color: 'yellow',
    type: 'warning',
    rgb: '#f90'
  },
  '-2': {
    name: 'Compile Error',
    short: 'CE',
    color: 'yellow',
    type: 'warning',
    rgb: '#f90'
  },
  '-1': {
    name: 'Wrong Answer',
    short: 'WA',
    color: 'red',
    type: 'danger',
    rgb: '#ed3f14'
  },
  '0': {
    name: 'Accepted',
    short: 'AC',
    color: 'green',
    type: 'success',
    rgb: '#19be6b'
  },
  '1': {
    name: 'Time Limit Exceeded',
    short: 'TLE',
    color: 'red',
    type: 'danger',
    rgb: '#ed3f14'
  },
  '2': {
    name: 'Memory Limit Exceeded',
    short: 'MLE',
    color: 'red',
    type: 'danger',
    rgb: '#ed3f14'
  },
  '3': {
    name: 'Runtime Error',
    short: 'RE',
    color: 'red',
    type: 'danger',
    rgb: '#ed3f14'
  },
  '4': {
    name: 'System Error',
    short: 'SE',
    color: 'gray',
    type: 'info',
    rgb: '#909399'
  },
  '5': {
    name: 'Pending',
    color: 'yellow',
    type: 'warning',
    rgb: '#f90'
  },
  '6': {
    name: 'Compiling',
    short: 'CP',
    color: 'green',
    type: 'info',
    rgb: '#25bb9b'
  },
  '7': {
    name: 'Judging',
    color: 'blue',
    type: '',
    rgb: '#2d8cf0'
  },
  '8': {
    name: 'Partial Accepted',
    short: 'PAC',
    color: 'blue',
    type: '',
    rgb: '#2d8cf0'
  },
  '9': {
    name: 'Submitting',
    color: 'yellow',
    type: 'warning',
    rgb: '#f90'
  },
  '10': {
    name: "Submitted Failed",
    color: 'gray',
    short: 'SF',
    type: 'info',
    rgb: '#909399',
  },
  '11': {
    name: "Output Limit Exceeded",
    color: 'red',
    short: 'OLE',
    type: 'danger',
    rgb: '#ed3f14',
  }
}

export const JUDGE_STATUS_RESERVE = {
  'snr': -5,
  'pe': -3,
  'ce': -2,
  'wa': -1,
  'ac': 0,
  'tle': 1,
  'mle': 2,
  're': 3,
  'se': 4,
  'Compiling': 5,
  'Pending': 6,
  'Judging': 7,
  'pa': 8,
  'sf': 10,
}

export const PROBLEM_LEVEL = {
  '0': {
    name: {
      'zh-CN': '简单',
      'en-US': 'Easy',
    },
    color: '#19be6b'
  },
  '1': {
    name: {
      'zh-CN': '中等',
      'en-US': 'Mid',
    },
    color: '#2d8cf0'
  },
  '2': {
    name: {
      'zh-CN': '困难',
      'en-US': 'Hard',
    },
    color: '#ed3f14'
  }
}


export const REMOTE_OJ = [
  {name: 'JSK', key: "JSK"},
  {name: 'MXT', key: "MXT"},
  {name: 'TKOJ', key: "TKOJ"},
  {name: "POJ", key: "POJ"},
  {name: 'HDU', key: "HDU"},
  {name: "Codeforces", key: "CF"},
  {name: "GYM", key: "GYM"},
  {name: 'AtCoder', key: "AC"},
  // {name: 'LOJ', key: "LOJ"}
]

export const CONTEST_STATUS = {
  'SCHEDULED': -1,
  'RUNNING': 0,
  'ENDED': 1
}

export const CONTEST_STATUS_REVERSE = {
  '-1': {
    name: 'Scheduled',
    color: '#f90'
  },
  '0': {
    name: 'Running',
    color: '#19be6b'
  },
  '1': {
    name: 'Ended',
    color: '#ed3f14'
  }
}

export const TRAINING_TYPE = {
  'Public': {
    color: 'success',
    name: 'Public'
  },
  'Private': {
    color: 'danger',
    name: 'Private'
  }
}

export const RULE_TYPE = {
  ACM: 0,
  OI: 1
}

export const USER_STATUS = [
  {value: 0, label: '正常'},
  {value: 1, label: '封禁'},
  {value: 2, label: '申请中'}
]

export const USER_ROLE = [
  {id: 1000, name: '超级管理员'},
  {id: 1001, name: '普通管理员'},
  {id: 1008, name: '题目管理员'},
  {id: 1002, name: '用户(默认)'},
  {id: 1003, name: '用户(禁止提交)'},
  {id: 1004, name: '用户(禁止发讨论)'},
  {id: 1005, name: '用户(禁言)'},
  {id: 1006, name: '用户(禁止提交&禁止发讨论)'},
  {id: 1007, name: '用户(禁止提交&禁言)'},
]

export const CONTEST_TYPE_REVERSE = {
  '0': {
    name: 'Public',
    color: 'success',
    tips: 'Public_Tips',
    submit: true,              // 公开赛可看可提交
    look: true,
  },
  '1': {
    name: 'Private',
    color: 'danger',
    tips: 'Private_Tips',
    submit: false,         // 私有赛 必须要密码才能看和提交
    look: false,
  },
  '2': {
    name: 'Protected',
    color: 'warning',
    tips: 'Protected_Tips',
    submit: false,       //保护赛，可以看但是不能提交，提交需要附带比赛密码
    look: true,
  }
}

export const CONTEST_TYPE = {
  PUBLIC: 0,
  PRIVATE: 1,
  PROTECTED: 2
}

export const USER_TYPE = {
  REGULAR_USER: 'user',
  ADMIN: 'admin',
  PROBLEM_ADMIN: 'problem_admin',
  SUPER_ADMIN: 'root'
}

export const JUDGE_CASE_MODE = {
  DEFAULT: 'default',
  ITERATE_UNTIL_WRONG: 'iterate_until_wrong'
}

export const STORAGE_KEY = {
  AUTHED: 'authed',
  PROBLEM_CODE: 'vojProblemCode',
  languages: 'languages',
  CONTEST_ANNOUNCE: 'vojContestAnnounce',
  individualLanguageAndTheme: 'vojIndividualLanguageAndTheme',
  CONTEST_RANK_CONCERNED: 'vojContestRankConcerned'
}

export function buildIndividualLanguageAndThemeKey() {
  return `${STORAGE_KEY.individualLanguageAndTheme}`
}

export function buildProblemCodeKey(problemID, contestID = null) {
  if (contestID) {
    return `${STORAGE_KEY.PROBLEM_CODE}_${contestID}_${problemID}`
  }
  return `${STORAGE_KEY.PROBLEM_CODE}_NoContest_${problemID}`
}

export function buildContestAnnounceKey(uid, contestID) {
  return `${STORAGE_KEY.CONTEST_ANNOUNCE}_${uid}_${contestID}`
}

export function buildContestRankConcernedKey(contestID) {
  return `${STORAGE_KEY.CONTEST_RANK_CONCERNED}_${contestID}`
}

