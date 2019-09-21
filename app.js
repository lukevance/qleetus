'use strict';

const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const R = require('ramda');

const env = require('./.env.json');

const {getBoxscore} = require('./espn');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// local test responses
// const responder = (res, data) => {
//   res.json({
//     thing: data.text
//   });
// }

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
    // TODO: get teamId from DB
    const teamId = 7;
    const data = await getBoxscore(env.leagueId, teamId);
    if (data.boxscore){
        const youHomeAway = ["home", "away"].find(homeAway => data.boxscore[homeAway].teamId == teamId);
        const oppHomeAway = ["home", "away"].find(homeAway => data.boxscore[homeAway].teamId != teamId);
        const message = 
          `Score update for team ${data.team.abbrev}
          Your score: ${data.boxscore[youHomeAway].totalPointsLive}
          Opponent score: ${data.boxscore[oppHomeAway].totalPointsLive}
          `;
        responder(res, {text: message});
    } else {
        responder(res, {text: data})
    } 
  } else {
    responder(res, {text: "Welcome to Fantasy Football Textbot!"});
  }
});

module.exports = app;