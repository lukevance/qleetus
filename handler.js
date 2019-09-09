'use strict';

const serverless = require('serverless-http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// generate twilio responses
const responder = (res, data) => {
  const twiml = new MessagingResponse();
  twiml.message(data.text);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
};

// MAIN ENTRY point for app
app.post('/handler', async (req, res) => {
  const message = "Welcome to Fantasy Football Textbot!";
  responder(res, {text: message});
});

const appHandler = serverless(app);

module.exports = { appHandler };