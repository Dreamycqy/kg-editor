const express = require('express')

const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.render('index', { title: 'kgeditor' })
})

module.exports = router
