const express = require('express')

const config = {
  dev: {
    env: 'development',
    port: '80',
    basePath: 'http://39.100.31.203:8080/res_lib',
  },
  test: {
    env: 'test',
    port: '80',
    basePath: 'http://39.100.31.203:8080/res_lib',
  },
  production: {
    env: 'production',
    port: '80',
    basePath: 'http://39.100.31.203:8080/res_lib',
  },
}
module.exports = config[process.env.NODE_ENV || 'development']
