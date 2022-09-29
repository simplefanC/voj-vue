import moment from 'moment'
import utils from './utils'
import time from './time'
import {PROBLEM_LEVEL, USER_ROLE, RULE_TYPE, USER_STATUS} from './constants'

// 友好显示时间
function fromNow(time) {
  return moment(time).fromNow()
}

function parseRole(num) {
  for (let role of USER_ROLE) {
    if(role.id == num)
      return role.name
  }
}

function parseStatus(num) {
  for (let status of USER_STATUS) {
    if(status.value == num)
      return status.label
  }
}

function parseContestType(num) {
  for(let key in RULE_TYPE){
    if(RULE_TYPE[key] == num)
      return key
  }

  // if (num == 0) {
  //   return 'ACM'
  // } else if (num == 1) {
  //   return 'OI'
  // }
}

function parseProblemLevel(num) {
  return PROBLEM_LEVEL[num].name;
}

export default {
  submissionMemory: utils.submissionMemoryFormat,
  submissionTime: utils.submissionTimeFormat,
  localtime: time.utcToLocal,
  fromNow: fromNow,
  parseContestType: parseContestType,
  parseRole: parseRole,
  parseStatus: parseStatus,
  parseProblemLevel: parseProblemLevel,
}
