var express = require('express');
var path = require('path');
var fs = require('fs');
const winston = require('winston');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
require('dotenv').config()


var app = express();
app.use(morgan('dev'));

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.splat(), // String interpolation splat for %d %s-style messages.
      winston.format.json()
    ),
    transports: [new winston.transports.Console()]
  });
  

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// TODO: use connect-mongo
app.use(session({
  secret: crypto.randomBytes(20).toString('hex'),
  saveUninitialized: false,
}
))

app.post('/api/login', (req,res) => {
  const username = req.body.username
  const password = req.body.password

  logger.info('username: %s password: %s', username, password )

  if (username && username == password) {
    res.status(200)
    req.session.regenerate(function(err) {
      logger.info("regenerate session %s err: %s", req.session.id, err)
      req.session.username = username
      req.session.extra = req.session.id
  
      res.json({code: "success", message: `succesfully authenticated ${req.session.id}`}) 
    });
    return;

  }
  else {
  
  res.status(401)
  res.json({code: "auth_failed", message: "Authentication failed"});
  }
})


app.get("/api/status", (req,res) => {
  res.json({"code": "success", message: "Service running normally"})
})

app.use(function(req,res) {
    res.status(404);
    res.send("File not found!");
});

app.listen(6000, function() {
    console.log('App started on port 6000');
});
