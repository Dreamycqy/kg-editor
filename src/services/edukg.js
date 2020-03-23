import request from '@/utils/request'
import URLS from '@/constants/URLS'

export function getUserList(body, rSymbol) {
  return request.post({
    url: URLS.USERLIST_GET,
    data: body,
    rSymbol,
  })
}

export function createProject(body, rSymbol) {
  return request.post({
    url: URLS.NEW_PROJECT,
    data: body,
    rSymbol,
  })
}

export function getProjectList(body, rSymbol) {
  return request.post({
    url: URLS.LIST_PROJECT,
    data: body,
    rSymbol,
  })
}

export function editProjectInfo(body, rSymbol) {
  return request.post({
    url: URLS.EDIT_PROJECT,
    data: body,
    rSymbol,
  })
}

export function createTaskInfo(body, rSymbol) {
  return request.post({
    url: URLS.NEW_TASK,
    data: body,
    rSymbol,
  })
}

export function editTaskInfo(body, rSymbol) {
  return request.post({
    url: URLS.EDIT_TASK,
    data: body,
    rSymbol,
  })
}

export function getTaskList(body, rSymbol) {
  return request.post({
    url: URLS.LIST_TASK,
    data: body,
    rSymbol,
  })
}
