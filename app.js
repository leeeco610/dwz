const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const debug = require('debug')('myapp:server');
const config = require('./conf');
const base58 = require('./tools/base58');

// grab the url model
const Url = require('./models/url');

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/api/shorten', function(req, res){
  const longUrl = req.query.url;
  let shortUrl = '';

  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      shortUrl = config.webhost + base58.encode(doc._id);

      // the document exists, so we return it without creating a new entry
      res.send(shortUrl);
    } else {
      // since it doesn't exist, let's go ahead and create it:
      const newUrl = Url({
        long_url: longUrl
      });

      // save the new link
      newUrl.save(function(err) {
        if (err){
          console.log(err);
        }

        shortUrl = config.webhost + base58.encode(newUrl._id);

        res.send(shortUrl);
      });
    }

  });

});

app.post('/api/shorten', function(req, res){
  const longUrl = req.body.url;
  let shortUrl = '';

  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      shortUrl = config.webhost + base58.encode(doc._id);

      // the document exists, so we return it without creating a new entry
      res.send(shortUrl);
    } else {
      // since it doesn't exist, let's go ahead and create it:
      const newUrl = Url({
        long_url: longUrl
      });

      // save the new link
      newUrl.save(function(err) {
        if (err){
          console.log(err);
        }

        shortUrl = config.webhost + base58.encode(newUrl._id);

        res.send(shortUrl);
      });
    }

  });

});

app.get('/:encoded_id', function(req, res){

  const base58Id = req.params.encoded_id;

  const id = base58.decode(base58Id);

  // check if url already exists in database
  Url.findOne({_id: id}, function (err, doc){
    if (doc) {
      res.redirect(doc.long_url);
    } else {
      res.redirect(config.webhost);
    }
  });

});


app.listen(config.port, function(){
  console.log(`Server listening on : ${config.webhost}`);
});