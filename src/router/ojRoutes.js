import Home from '@/views/oj/Home.vue'
import SetNewPassword from "@/views/oj/user/SetNewPassword.vue"
import UserHome from "@/views/oj/user/UserHome.vue"
import Setting from "@/views/oj/user/Setting.vue"
import ProblemLIst from "@/views/oj/problem/ProblemList.vue"
import Logout from "@/views/oj/user/Logout.vue"
import SubmissionList from "@/views/oj/status/SubmissionList.vue"
import SubmissionDetails from "@/views/oj/status/SubmissionDetails.vue"
import ContestList from "@/views/oj/contest/ContestList.vue"
import Problem from "@/views/oj/problem/Problem.vue"
import ACMRank from "@/views/oj/rank/ACMRank.vue"
import OIRank from "@/views/oj/rank/OIRank.vue"
import ContestDetails from "@/views/oj/contest/Contest.vue"
import ACMScoreBoard from "@/views/oj/contest/outside/ACMScoreBoard.vue"
import OIScoreBoard from "@/views/oj/contest/outside/OIScoreBoard.vue"
import ContestProblemList from "@/views/oj/contest/children/ContestProblemList.vue"
import ContestRank from "@/views/oj/contest/children/ContestRank.vue"
import ACMInfoAdmin from "@/views/oj/contest/children/ACMInfoAdmin.vue"
import Announcements from "@/components/oj/common/Announcements.vue"
import ContestComment from "@/views/oj/contest/children/ContestComment.vue"
import ContestPrint from "@/views/oj/contest/children/ContestPrint.vue"
import ContestAdminPrint from "@/views/oj/contest/children/ContestAdminPrint.vue"
import ContestRejudgeAdmin from "@/views/oj/contest/children/ContestRejudgeAdmin.vue"
import DiscussionList from "@/views/oj/discussion/discussionList.vue"
import Discussion from "@/views/oj/discussion/discussion.vue"
import Introduction from "@/views/oj/about/Introduction.vue"
import Developer from "@/views/oj/about/Developer.vue"
import Message from "@/views/oj/message/message.vue"
import UserMsg from "@/views/oj/message/UserMsg.vue"
import SysMsg from "@/views/oj/message/SysMsg.vue"
import TrainingList from "@/views/oj/training/TrainingList.vue"
import TrainingDetails from "@/views/oj/training/TrainingDetails.vue"
import TrainingProblemList from "@/views/oj/training/TrainingProblemList.vue"
import TrainingRank from "@/views/oj/training/TrainingRank.vue"
import NotFound from "@/views/404.vue"

const ojRoutes = [
  {
    path: '/',
    redirect: '/home',
    component: Home,
    meta: {title: 'Home'}
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {title: 'Home'}
  },
  {
    path: '/problem',
    name: 'ProblemList',
    component: ProblemLIst,
    meta: {title: 'Problem'}
  },
  {
    path: '/problem/:problemID',
    name: 'ProblemDetails',
    component: Problem,
    meta: {title: 'Problem Details'}
  },
  {
    path: '/training',
    name: 'TrainingList',
    component: TrainingList,
    meta: {title: 'Training'}
  },
  {
    name: 'TrainingDetails',
    path: '/training/:trainingID/',
    component: TrainingDetails,
    meta: {title: 'Training Details'},
    children: [
      {
        name: 'TrainingProblemList',
        path: 'problems',
        component: TrainingProblemList,
        meta: {title: 'Training Problem'}
      },
      {
        name: 'TrainingProblemDetails',
        path: 'problem/:problemID/',
        component: Problem,
        meta: {title: 'Training Problem Details'}
      },
      {
        name: 'TrainingRank',
        path: 'rank',
        component: TrainingRank,
        meta: {title: 'Training Rank'}
      }
    ]
  },
  {
    path: '/contest',
    name: 'ContestList',
    component: ContestList,
    meta: {title: 'Contest'}
  },
  {
    path: '/contest/acm-scoreboard/:contestID',
    name: 'ACMScoreBoard',
    component: ACMScoreBoard,
    meta: {title: 'ACM Contest ScoreBoard'}
  },
  {
    path: '/contest/oi-scoreboard/:contestID',
    name: 'OIScoreBoard',
    component: OIScoreBoard,
    meta: {title: 'OI Contest ScoreBoard'}
  },
  {
    name: 'ContestDetails',
    path: '/contest/:contestID/',
    component: ContestDetails,
    meta: {title: 'Contest Details', requireAuth: true},
    children: [
      {
        name: 'ContestSubmissionList',
        path: 'submissions',
        component: SubmissionList,
        meta: {title: 'Contest Submission'}
      },
      {
        name: 'ContestSubmissionDetail',
        path: 'problem/:problemID/submission-detail/:submitID',
        component: SubmissionDetails,
        meta: {title: 'Contest Submission Detail'}
      },
      {
        name: 'ContestProblemList',
        path: 'problems',
        component: ContestProblemList,
        meta: {title: 'Contest Problem'}
      },
      {
        name: 'ContestProblemDetails',
        path: 'problem/:problemID/',
        component: Problem,
        meta: {title: 'Contest Problem Details'}
      },
      {
        name: 'ContestAnnouncementList',
        path: 'announcements',
        component: Announcements,
        meta: {title: 'Contest Announcement'}
      },
      {
        name: 'ContestRank',
        path: 'rank',
        component: ContestRank,
        meta: {title: 'Contest Rank'}
      },
      {
        name: 'ContestACInfo',
        path: 'ac-info',
        component: ACMInfoAdmin,
        meta: {title: 'Contest AC Info', requireAdmin: true}
      },
      {
        name: 'ContestRejudgeAdmin',
        path: 'rejudge',
        component: ContestRejudgeAdmin,
        meta: {title: 'Contest Rejudge', requireSuperAdmin: true}
      },
      {
        name: 'ContestComment',
        path: 'comment',
        component: ContestComment,
        meta: {title: 'Contest Comment'}
      },
      {
        name: 'ContestPrint',
        path: 'print',
        component: ContestPrint,
        meta: {title: 'Contest Print'}
      },
      {
        name: 'ContestAdminPrint',
        path: 'admin-print',
        component: ContestAdminPrint,
        meta: {title: 'Contest Admin Print'}
      }
    ]
  },
  {
    path: '/status',
    name: 'SubmissionList',
    component: SubmissionList,
    meta: {title: 'Status'}
  },
  {
    path: '/submission-detail/:submitID',
    name: 'SubmissionDetail',
    component: SubmissionDetails,
    meta: {title: 'Submission Detail'}
  },
  {
    path: '/acm-rank',
    name: 'ACM Rank',
    component: ACMRank,
    meta: {title: 'ACM Rank'}
  },
  {
    path: '/oi-rank',
    name: 'OI Rank',
    component: OIRank,
    meta: {title: 'OI Rank'}
  },
  {
    path: '/reset-password',
    name: 'SetNewPassword',
    component: SetNewPassword,
    meta: {title: 'Reset Password'}
  },
  {
    name: 'UserHome',
    path: '/user-home',
    component: UserHome,
    meta: {title: 'User Home'}
  },
  {
    name: 'Setting',
    path: '/setting',
    component: Setting,
    meta: {requireAuth: true, title: 'Setting'}
  },
  {
    name: 'Logout',
    path: '/logout',
    component: Logout,
    meta: {requireAuth: true, title: 'Logout'}
  },
  {
    path: '/discussion',
    name: 'AllDiscussion',
    meta: {title: 'Discussion'},
    component: DiscussionList
  },
  {
    path: '/discussion/:problemID',
    name: 'ProblemDiscussion',
    meta: {title: 'Discussion'},
    component: DiscussionList
  },
  {
    path: '/discussion-detail/:discussionID',
    name: 'DiscussionDetail',
    meta: {title: 'Discussion Detail'},
    component: Discussion
  },
  {
    path: '/introduction',
    meta: {title: 'Introduction'},
    component: Introduction,
  },
  {
    path: '/developer',
    meta: {title: 'Developer'},
    component: Developer,
  },
  {
    name: 'Message',
    path: '/message/',
    component: Message,
    meta: {requireAuth: true, title: 'Message'},
    children: [
      {
        name: 'DiscussMsg',
        path: 'discuss',
        component: UserMsg,
        meta: {requireAuth: true, title: 'Discuss Message'}
      },
      {
        name: 'ReplyMsg',
        path: 'reply',
        component: UserMsg,
        meta: {requireAuth: true, title: 'Reply Message'}
      },
      {
        name: 'LikeMsg',
        path: 'like',
        component: UserMsg,
        meta: {requireAuth: true, title: 'Like Message'}
      },
      {
        name: 'SysMsg',
        path: 'sys',
        component: SysMsg,
        meta: {requireAuth: true, title: 'System Message'}
      },
      {
        name: 'MineMsg',
        path: 'mine',
        component: SysMsg,
        meta: {requireAuth: true, title: 'Mine Message'}
      },
    ]
  },
  {
    path: '*',
    component: NotFound,
    meta: {title: '404'}
  }
]
export default ojRoutes
