'use strict';
const app = require('express')(),
      bodyParser = require('body-parser'),
      authCtrl = require('./controllers/AuthCtrl.js'),
      monitorCtrl = require('./controllers/MonitorCtrl.js'),
      jwt = require('jsonwebtoken');
require('dotenv').load();
const PORT = process.env.PORT || 3000;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(checkTokenAuth);
app.use('/auth', authCtrl);
app.use('/monitor', monitorCtrl);

app.listen(PORT, () => console.log(`listening on port ${PORT}`))

process.on('uncaughtException', function (error) {
  console.error(error.stack);
  process.exit(1);
});

function checkTokenAuth(req, res, next){
  if ( req.path === '/auth/login' || req.method === "OPTIONS"){
    next();
    return;
  }
  // check header token
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    var token = req.headers.authorization.split(' ')[1];
    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
       if (err) {
         console.error("User not authorized");
         return res.status(403).send({success: false,message: 'No token provided.'});
       } else {
            req.userId = decoded.userId;
            next();
       }
    });
  } else {
    console.error("User not authorized");
    return res.status(403).send({success: false,message: 'No token provided.'});
  }
}
