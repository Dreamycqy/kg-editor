import request from '@/utils/request'
import URLS from '@/constants/URLS'

export function fetchUserInfo(data) {
  return request.postUser({
    url: URLS.USER_GET_USER,
    data: {
      data,
      cookie: window.localStorage.cookie ? JSON.parse(window.localStorage.cookie).join('; ') : '',
    },
    showError: false,
  })
}

export function logout(data) {
  return request.postUser({
    url: URLS.USER_LOGOUT,
    data: {
      data,
      cookie: window.localStorage.cookie ? JSON.parse(window.localStorage.cookie).join('; ') : '',
    },
    failed: () => { return null },
  })
} //

export function login(data) {
  return request.postUser({
    url: URLS.USER_LOGIN,
    data: {
      data,
      cookie: window.localStorage.cookie ? JSON.parse(window.localStorage.cookie).join('; ') : '',
    },
  })
}

export function register(data) {
  return request.postUser({
    url: URLS.USER_REGISTER,
    data: {
      data,
      cookie: window.localStorage.cookie ? JSON.parse(window.localStorage.cookie).join('; ') : '',
    },
  })
}
