const express = require('express')

const config = {
  dev: {
    env: 'development',
    port: '8123',
    basePath: 'http://edukg.cn',
  },
  test: {
    env: 'test',
    port: '8123',
    basePath: 'http://edukg.cn',
  },
  production: {
    env: 'production',
    port: '8123',
    basePath: 'http://edukg.cn',
  },
}
module.exports = config[process.env.NODE_ENV || 'development']
