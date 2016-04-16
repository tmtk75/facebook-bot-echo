"use strict"
var express        = require('express'),
    bodyParser     = require('body-parser'),
    logger         = require("morgan"),
    path           = require("path"),
    fs             = require("fs"),
    fetch          = require("node-fetch");

var PORT = process.env.PORT || 3000;

var app = express();
app.set('port', PORT);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));

app.get('/', function(req, res, next) {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

function sendTextMessage(sender, text) {
  fetch('https://graph.facebook.com/v2.6/me/messages' + "?access_token=" + process.env.ACCESS_TOKEN, {
    method: 'POST',
    headers: {"content-type": "application/json; charset=UTF-8"},
    body: JSON.stringify({
      recipient: {id: sender},
      message: {text: text},
    })
  })
  .then((res) => console.log("status", res.status))
  .catch((err) => console.error(err));
}

app.post('/', function(req, res, next) {
  var events = req.body.entry[0].messaging;
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      sendTextMessage(sender, event.message.text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

app.listen(app.get("port"), _ => console.log("server started:", app.get("port")));

