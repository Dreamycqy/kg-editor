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

export function getProjectClassesTree(body, rSymbol) {
  return request.post({
    url: URLS.LIST_CLASS,
    data: body,
    rSymbol,
  })
}

export function getProjectPropertiesTree(body, rSymbol) {
  return request.post({
    url: URLS.LIST_PROPS,
    data: body,
    rSymbol,
  })
}

export function getProjectIndividualsTree(body, rSymbol) {
  return request.post({
    url: URLS.LIST_INDIS,
    data: body,
    rSymbol,
  })
}

export function editClasses(body, rSymbol) {
  return request.post({
    url: URLS.EDIT_CLASS,
    data: body,
    rSymbol,
  })
}

export function editProperties(body, rSymbol) {
  return request.post({
    url: URLS.EDIT_PROPS,
    data: body,
    rSymbol,
  })
}

export function editIndividuals(body, rSymbol) {
  return request.post({
    url: URLS.EDIT_INDIS,
    data: body,
    rSymbol,
  })
}

export function getSonClass(body, rSymbol) {
  return request.post({
    url: URLS.CLASS_CONNECT,
    data: body,
    rSymbol,
  })
}
