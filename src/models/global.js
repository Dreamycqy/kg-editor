export default {
  namespace: 'global',
  state: {
    locale: 'cn',
    userInfo: {
      email: 'admin@aliyun.com',
    },
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
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'getUserInfo', payload: {} })
    },
  },
}
