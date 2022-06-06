var express = require('express');
var path = require('path');
var fs = require('fs');
const winston = require('winston');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const https = require('https');

require('dotenv').config()



var httpsOptions = {}
if (fs.existsSync(path.resolve(__dirname, '../certs/localhost.crt'))) {
   if (!process.env.PASSPHRASE) {
     console.log("The environment variable PASSPHRASE with the passphrase for the certificate key is not set. Exiting...")
     process.exit(1)
   }

   httpsOptions = {
       key: fs.readFileSync(path.resolve(__dirname, '../certs/localhost.key')),
       cert: fs.readFileSync(path.resolve(__dirname, '../certs/localhost.crt')),
       passphrase: process.env.PASSPHRASE,
   }
 }


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
  

  
  app.use((req,res,next) => {
    // to protect agains CSRF require X-Requested-With , the browser SOP will prevent cross site request with non-standard headers
    if (req.get('x-requested-with') === undefined) {
      logger.info('Reject request because no x-requested-with header was present')
      res.status(415).json({message: "This server only allows request with x-requested-with header set to prevent CSRF attacks"})
      return;
    }
    
    // allow only requests with content-type: application/json 
    // for GET request with empty body we allow any content-type. 
    // this prevents CRSF attacks as browser SOP disallows cross-site request if content-type is application/json'
    if (!req.is('json') && req.body) { //req.body will be undefined if no empty body (bodyParser.json() middleware is not run yet)
      logger.info('Reject request because content-type was %s and body was %s', req.get('content-type'), req.body )
      res.status(415).json({message: "This server only allows request with content-type set to application/json to prevent CSRF attacks"})
      return
    }
    
    next()
  })

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))
  
  // parse application/json
  app.use(bodyParser.json())

// TODO: use connect-mongo
app.use(session({
  secret: crypto.randomBytes(20).toString('hex'),
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: Object.keys(httpsOptions).length != 0,
    maxAge: 3600*1000, // 1 hour 
  }
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

app.get("/api/userinfo", (req,res) => {
  logger.info("userinfo: %s", req.session.username);
  res.json({loggedInStatus: Boolean(req.session.username), username: req.session.username })
})

app.post("/api/logout", (req, res) => {
  logger.info("logging out: ", req.session.username);
  req.session.destroy(() => {
    res.json({code: "success"})
  })
})


app.get("/api/status", (req,res) => {
  res.json({"code": "success", message: "Service running normally"})
})

app.use(function(req,res) {
    res.status(404);
    res.send("File not found!");
});



var server = https.createServer(httpsOptions, app).listen(6000, function() {
    console.log('App started on port 6000');
});
