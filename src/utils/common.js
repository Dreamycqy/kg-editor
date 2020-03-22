import React from 'react'
import queryString from 'query-string'
import { Select } from 'antd'

const { Option } = Select

export const getUrlParams = (type) => {
  const parsed = queryString.parse(window.location.search)
  return (type ? parsed[type] : parsed)
}

export const changeUrlQuery = (newQuery) => {
  const query = {
    ...queryString.parse(window.location.search),
    ...newQuery,
  }
  const queryStr = queryString.stringify(query)
  window.history.pushState(null, null, `?${queryStr}`)
}

export const makeOptionNormal = (array) => {
  const children = []
  for (const i of array) {
    children.push(<Option key={i} value={i}>{i} ({i})</Option>)
  }
  return children
}

export const makeOption = (array) => {
  const children = []
  for (const i of array) {
    children.push(<Option key={i.value} value={i.value}>{i.name}</Option>)
  }
  return children
}

export const makeOptionSimple = (array) => {
  const children = []
  for (const i of array) {
    children.push(<Option key={i.email} value={i.email}>{i.name} ({i.email})</Option>)
  }
  return children
}

export const getCookie = (array) => {
  const result = {}
  for (const i of array) {
    const arr = i.split('=')
    if (arr[0]) {
      // eslint-disable-next-line prefer-destructuring
      result[arr[0]] = arr[1].split('; ')[0]
    }
  }
  return result
}

export const isInArray = (arr, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true
    }
  }
  return false
}

// 找出重名不重学科的节点
export const theSameLabel = (other) => {
  const samelabel = []
  for (let h = 0; h < other.length; h++) {
    const each = other[h]
    const lab = each.label
    const cor = each.course
    for (let g = 0; g < other.length; g++) {
      const obj = other[g]
      const { label } = obj
      const { course } = obj

      if (label === lab && cor !== course) {
        samelabel.push(each)
      }
    }
  }
  return samelabel
}
