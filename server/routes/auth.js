const request = require('request');
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const config = require('../config');

const LOGIN = 'login';
const LOGOUT = 'logout';
const GETUSER = 'getUser';
const FAKELOGIN = 'fakeLogin'

function encode(str1 = '', str2 = '') {
  const md5 = crypto.createHash('md5');
  md5.update(str2);
  str2 = str1 + md5.digest('hex');
  for (let i = 0; i < 1000; i++) {
    const sha1 = crypto.createHash('sha1');
    sha1.update(str2);
    str2 = sha1.digest('hex');
  }
  return str2;
}

function aesDecrypt(encrypted, key) {
  const decipher = crypto.createDecipher('aes192', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function getUser(req) {
  const { dataplatform_token, dataplatform_email } = req.cookies;
  var opt = {
    method: 'POST',
    url: 'http://homepage-main-dataplatform.int.yidian-inc.com/databe/authority/getUser',
    headers: {
      'Content-Type': 'application/json',
      cookie: dataplatform_token,
      email: dataplatform_email,
    },
    json: true,
    body: {
      userName: dataplatform_email,
    },
    pool: {
      maxSockets: Infinity
    }
  }
  return new Promise((reslove, reject) => {
    request(opt, function (error, response, body) {
      try {
        if (!error) {
          if (body.header.code === 0) {
            reslove(body);
          } else {
            reject({ header: { code: 1, message: '获取失败，请重试' }, data: [] });
          }
        } else {
          reject({ header: { code: 1, message: typeof error === 'string' ? error : JSON.stringify(error) }, data: [] });
        }
      } catch (error) {
        reject({ header: { code: 1, message: '服务器发生错误!', error, }, data: [] });
      }
    });
  })
}

function login(username, password) {
  const params = {
    userName: username,
    passWord: aesDecrypt(password, username),
  }
  var opt = {
    method: 'POST',
    url: 'http://homepage-main-dataplatform.int.yidian-inc.com/databe/authority/login',
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
    body: params,
    pool: {
      maxSockets: Infinity
    }
  }
  return new Promise((reslove, reject) => {
    request(opt, function (error, response, body) {
      try {
        if (!error) {
          if (body.header.code === 0) {
            reslove(body.data);
          } else {
            if(fakeUserName) {
              reject({header: body.data, data: []});
            } else {
              reject({ header: { code: 1, message: '用户名或者密码错误，请重试' }, data: [] });
            }

          }
        } else {
          reject({ header: { code: 1, message: typeof error === 'string' ? error : JSON.stringify(error) }, data: [] });
        }
      } catch (error) {
        reject({ header: { code: 1, message: '服务器发生错误!', error, }, data: [] });
      }
    });
  })
}

function logout(res, domain) {
  res.clearCookie('dataplatform_uid', {
    domain,
  });
  res.clearCookie('dataplatform_email', {
    domain
  });
  res.clearCookie('dataplatform_token', {
    domain
  });
  res.clearCookie('dataplatform_nickname', {
    domain
  });
}

router.post('/:action', function (req, res, next) {
  const action = req.params.action;
  const username = req.body.username;
  const password = req.body.password;
  const fakeUserName = req.body.fakeUserName;
  let domain
  if (config.env === 'production') {
    const hns = req.hostname.split('.');
    const domain1 = hns.pop();
    const domain2 = hns.pop();
    domain = `.${domain2}.${domain1}`;
  }
  switch (action) {
    // case LOGIN:
    // res.cookie('dataplatform_uid', '1', { domain });
    //   res.cookie('dataplatform_email', 'wangxueliang@yidian-inc.com', { domain });
    //   res.cookie('dataplatform_nickname', '王学良', { domain });
    //   res.cookie('dataplatform_token', '222', { domain });
    //   res.json({ header: { code: 0 }, data: [{ email: 'wangxueliang@yidian-inc.com' }] });
    // break;
    case LOGIN:
      login(username, password, fakeUserName).then((data) => {
        res.cookie('dataplatform_uid', data.userid, { domain });
        res.cookie('dataplatform_email', data.username, { domain });
        res.cookie('dataplatform_nickname', data.nickname, { domain });
        res.cookie('dataplatform_token', data.cookie, { domain });
        res.json({ header: { code: 0 }, data: [{ email: data.username }] });
      }).catch((error) => {
        logout(res, domain);
        res.json(error);
      });
      break;
    case LOGOUT:
      logout(res, domain);
      res.json({ header: { code: 0 }, data: [] });
      break;
    case GETUSER:
      getUser(req).then((data) => {
        res.json(data)
      }).catch((error) => {
        res.json(error);
      });
      break;
    default:
      next();
  }
});

module.exports = router;
