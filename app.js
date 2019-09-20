'use strict';

const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const R = require('ramda');

const env = require('./.env.json');

const {getBoxscore} = require('./espn');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// generate twilio responses
const responder = async (res, data) => {
  const twiml = new MessagingResponse();
  twiml.message(data.text);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
};

// MAIN ENTRY point for app
app.post('/handler', async (req, res) => {
  if (req.body.From === env.myNumber){
    const teamId = 7;
    const boxscore = await getBoxscore(env.leagueId, teamId);
    if (boxscore.boxscore){
        const isYourTeam = homeAway => homeAway.teamId == boxscore.team.id;
        const youHomeAway = ["home", "away"].find(homeAway => boxscore.boxscore[homeAway].teamId === teamId);
        const oppHomeAway = ["home", "away"].find(homeAway => boxscore.boxscore[homeAway].teamId !== teamId);
        const message = 
          `Score update for team ${boxscore.team.abbrev}
          Your score: ${boxscore.boxscore[youHomeAway].totalPointsLive}
          Opponent score: ${boxscore.boxscore[oppHomeAway].totalPointsLive}
          `;
          await responder(res, {text: message});
    } else {
        responder(res, {text: boxscore})
    } 
  } else {
    responder(res, {text: "Welcome to Fantasy Football Textbot!"});
  }
});

module.exports = app;