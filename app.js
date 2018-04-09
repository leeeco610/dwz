const express = require('express');
const app = express();
const crypto = require('crypto');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const config = require('./conf');
const base58 = require('./tools/base58');
const rds = require('./tools/createRedis');

const CACHE_TIME = 300; // 数据缓存时间


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express["static"](path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.send('ok');
  // res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/api/shorten', function(req, res) {
  const longUrl = req.query.url;
  console.log(`longUrl => `, longUrl);
  shorten(longUrl).then((shortUrl) => {
    res.send(shortUrl);
  });
});

app.post('/api/shorten', function(req, res) {
  const longUrl = req.body.url;
  console.log(`longUrl => `, longUrl);
  shorten(longUrl).then((shortUrl) => {
    res.send(shortUrl);
  });
});

app.get('/:encoded_id', function(req, res) {
  const base58Id = req.params.encoded_id;
  console.log(`base58Id => `, base58Id);
  const seq = base58.decode(base58Id);
  console.log(`seq => `, seq);
  rds.get(seq).then((longUrl) => {
    console.log(`longUrl => `, longUrl);
    if (longUrl) {
      res.redirect(301, longUrl);
    } else {
      res.sendFile(path.join(__dirname, 'views/404.html'));
    }
  });
});


// md5加密
function md5(str) {
  return crypto.createHash('md5').update(str)
  .digest('hex');
}

// 短网址存入redis
function setShortUrl(longUrl) {
  const seqKey = md5(longUrl);
  return new Promise((resolve) => {
    rds.seqIncr().then((seq) => {
      console.log(`seq => `, seq);
      let shortUrl = config.webhost + base58.encode(seq);
      console.log(`shortUrl => `, shortUrl);
      rds.set(seqKey, seq, CACHE_TIME);
      rds.set(seq, longUrl, CACHE_TIME); // 数据缓存5分钟
      resolve(shortUrl);
    });
  })
}

// 短网址处理get，post
function shorten(longUrl) {
  const seqKey = md5(longUrl);

  return new Promise((resolve) => {
    rds.get(seqKey).then((seq) => {
        if (!seq) { // redis不存在短网址，则存储
          setShortUrl(longUrl).then((shortUrl) => {
            resolve(shortUrl);
          });
        } else {
          console.log(`seq => `, seq);
          let shortUrl = config.webhost + base58.encode(seq);
          console.log(`shortUrl => `, shortUrl);
          resolve(shortUrl);
        }
    });
  })
}

app.listen(config.port, function() {
  console.log(`Server listening on : ${config.webhost}`);
});
