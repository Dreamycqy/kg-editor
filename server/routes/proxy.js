const request = require('request')
const express = require('express')
const qs = require('qs')
const router = express.Router()
const config = require('../config')

router.all('/', function (req, res) {
  const { hostname, method } = req
  let url = req.baseUrl
  const { basePath } = config
  if (url.indexOf('/api') > -1) {
    url = '/build' + url.split('/api')[1]
  }
  url = (typeof basePath === 'string' ? basePath : basePath[hostname]) + url
  let cookie = ''
  if (method === 'GET') {
    cookie = qs.parse(req.query).cookie
  } else {
    cookie = req.body.cookie
  }
  const opt = {
    method,
    url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cookie' : cookie,
    },
    timeout: 40e3,
    json: true,
    pool: {
      maxSockets: Infinity,
    },
    withCredentials: true,
  }
  if (method === 'GET') {
    const str = qs.parse(req.query).data
    opt.query = qs.stringify(str)
  } else {
    opt.json = true
    opt.body = qs.stringify(req.body.data)
  }
  request(opt, (error, response, body) => {
    try {
      if (!error) {
        if (response && response.statusCode) {
          res.status(response.statusCode)
        }
        if (typeof body === 'string') {
          res.json({ data: JSON.parse(body), cookie: response.headers['set-cookie'] })
        } else {
          res.json({ data: body, cookie: response.headers['set-cookie'] })
        }
      } else {
        res.json({ header: { code: 1, message: typeof error === 'string' ? error : JSON.stringify(error) }, data: [] })
      }
    } catch (error) { // eslint-disable-line
      // res.json({ header: { code: 1, message: '服务器发生错误!', error, }, data: [] });
      res.json({ token: body })
    }
  })
})

module.exports = router
