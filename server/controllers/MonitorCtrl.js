'use strict';
const express = require('express'),
      router = express.Router(),
      {Gaze} = require('gaze'),
      gaze = new Gaze();
let   logs = {},
      listeners = 0;

router.post('/start', (req, res) => {
  if (logs[req.userId]){
    // Folder already been watched
    listeners++;
    console.log("Folder already been watched");
    res.json({status: "success"});
  } else {
    logs[req.userId] = [];
    // New watch on folder
    res.json(watchFolder(req.body.folder, req.userId));
    listeners++;
    console.log("Start monitoring");
  }
});

router.post('/stop', (req, res) => {
  delete logs[req.userId];
  listeners--;
  if (!listeners){
    // Remove watch from file
    gaze.close();
    console.log("Stop monitoring");
  }
  res.json({status: "success"});
});

router.get('/status', (req, res) => {
  res.send(logs[req.userId]);
});

function watchFolder(folder, userId){
  if (!listeners){
    gaze.add(folder + '**/*');
  }
  gaze.on('error', error => {
    return ({status: "error", msg: error});
  });
  gaze.on('renamed', filepath => {
    // check that user listen to this folder
    if (logs[userId]){
      logs[userId].push({status: 1, file: filepath, time: Date.now()});
      console.log(filepath + ' was rename');
    }
  });
  // On file added
  gaze.on('added', filepath => {
    if (logs[userId]){
      logs[userId].push({status: 0, file: filepath, time: Date.now()});
      console.log(filepath + ' was added');
    }
  });
  // On file deleted
  gaze.on('deleted', filepath => {
    if (logs[userId]){
      logs[userId].push({status: 2, file: filepath, time: Date.now()});
      console.log(filepath + ' was deleted');
    }

  });
  return ({status: "success"});
}

module.exports = router;
