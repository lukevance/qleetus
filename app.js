'use strict';

const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const R = require('ramda');

const env = require('./.env.json');
const { scoreUpdateSummaryText, scoreUpdateDetails } = require('./text-cmd-handler');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// generate twilio responses
const responder = async (res, data) => {
  const twiml = new MessagingResponse();
  twiml.message(data.text);
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};

const textCommandRouter = async textInfo => {
  const textBody = textInfo.Body.toLowerCase();
  switch (textBody) {
    case "score update":
      return await scoreUpdateSummaryText(textInfo.From);
    case "details":
      return await scoreUpdateDetails(textInfo.From);
    default:
      return {text: `no command available for "${textInfo.Body}", if you're confused, try HELP`};
  }
};

// MAIN ENTRY point for app
app.post('/handler', async (req, res) => {
  if (req.body.From && req.body.Body) {
    console.log(req.body);
    const responseObj = await textCommandRouter(req.body);
    responder(res, responseObj);
  } else {
    res.status(400).json({
      error: "This Fantasy Football Textbot API expected a phone number with the incoming request."
    });
  }
});

module.exports = app;