// import queryString from 'query-string'
// import * as globalService from '../services/global'

export default {
  namespace: 'global',
  state: {
    locale: 'cn',
    userInfo: {
      email: '',
      userName: '',
      role: '',
      projectList: [],
      taskList: [],
    },
    userList: [],
  },
  reducers: {
    save(state, { payload: { userInfo = {} } }) {
      return { ...state, userInfo }
    },
    updateState: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: {
    // *getUserInfo({ payload }, { call, put }) { // eslint-disable-line
    //   if (window.location.pathname.indexOf('login') < 0) {
    //     const data = yield call(globalService.fetchUserInfo,
    //       queryString.stringify({ email: this.state.email }))
    //     if (data) {
    //       yield put({
    //         type: 'save',
    //         payload: {
    //           userInfo: data,
    //         },
    //       })
    //     } else {
    //       window.location.href = '/login'
    //     }
    //   }
    // },
    // *logout({ payload }, { call }) { // eslint-disable-line
    //   yield call(globalService.logout, {})
    //   window.location.href = '/login'
    // },
    // *login({ payload }, { call }) { // eslint-disable-line
    //   yield call(globalService.login, {})
    //   window.location.href = '/'
    // },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'getUserInfo', payload: {} })
    },
  },
}
