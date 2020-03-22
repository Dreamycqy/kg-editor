import request from '@/utils/request'
import URLS from '@/constants/URLS'

export function getUserList(body, rSymbol) {
  return request.post({
    url: URLS.USERLIST_GET,
    data: {
      data: body,
      cookie: window.localStorage.cookie ? JSON.parse(window.localStorage.cookie).join('; ') : '',
    },
    rSymbol,
  })
}
