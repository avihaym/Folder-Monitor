'use strict';
const express = require('express'),
      router = express.Router(),
      bcrypt = require('bcrypt'),
      sqlite3 = require('sqlite3').verbose(),
      jwt = require('jsonwebtoken');
require('dotenv').load();
const db = new sqlite3.Database('./db/users.db', (err) => {
  if (err) {console.error(err.message);}
  console.log('Connected to DB.');
});

router.post('/login', (req, res) => {
  db.all("SELECT * from users where email = ?", [req.body.email], (err, row) => {
    if (err) {console.error(err.message);}
    if (row.length > 0){
      if (bcrypt.compareSync(req.body.password, row[0].password)){
         let token = jwt.sign({userId: row[0].id}, process.env.SECRET,  {expiresIn: '24h'});
        res.json({status: "success", token: token})
      } else {
        res.json({status: "error", msg: "User not found."});
      }
    } else {
      res.json({status: "error", msg: "User not found."});
    }
  });
});

module.exports = router;
