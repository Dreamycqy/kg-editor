import request from '@/utils/request'
import URLS from '@/constants/URLS'

export function fetchUserInfo(data) {
  return request.post({
    url: URLS.USER_GET_USER,
    data,
    showError: false,
  })
}

export function logout(data) {
  return request.post({
    url: URLS.USER_LOGOUT,
    data,
    failed: () => { return null },
  })
} //

export function login(data) {
  return request.post({
    url: URLS.USER_LOGIN,
    data,
  })
}

export function register(data) {
  return request.post({
    url: URLS.USER_REGISTER,
    data,
  })
}
