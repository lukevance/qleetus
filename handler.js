'use strict';

const serverless = require('serverless-http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const R = require('ramda');

const env = require('./.env.json');

const {getBoxscore} = require('./espn');

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
  if (req.body.From === env.phone){
    const boxscore = await getBoxscore(env.leagueId, env.teamId);
    const isYourTeam = homeAway => homeAway.teamId == boxscore.team.id;
    const youHomeAway = Object.keys(R.filter(isYourTeam, boxscore.boxscore))[0];
    const oppHomeAway = Object.keys(R.filter(!isYourTeam, boxscore.boxscore))[0];
    const message = 
      `Score update for team ${boxscore.team.abbrev}

      You: ${boxscore.boxscore[youHomeAway].totalPoints}
      Opponent: ${boxscore.boxscore[oppHomeAway].totalPoints}
      `;
      responder(res, {text: message});
  } else {
    responder(res, {text: "Welcome to Fantasy Football Textbot!"});
  }
});

const appHandler = serverless(app);

module.exports = { appHandler };