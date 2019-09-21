'use strict';

const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const R = require('ramda');

const env = require('./.env.json');
const { getUser } = require('./users');
const { getBoxscore } = require('./espn');

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
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};

// MAIN ENTRY point for app
app.post('/handler', async (req, res) => {
  if (req.body.From) {
    console.log('from: ' + req.body.From)
    const user = await getUser(req.body.From);
    console.log(user);
    // check that user was returned
    if (user) {
      const league = user.leagues ? user.leagues.find(league => league.provider === "espn") : null;
      // check that user has an espn league
      if (league) {
        // user exists and has ESPN league
        const data = await getBoxscore(league.id, league.teamId);
        if (data.boxscore) {
          const youHomeAway = ["home", "away"].find(homeAway => data.boxscore[homeAway].teamId == league.teamId);
          const oppHomeAway = ["home", "away"].find(homeAway => data.boxscore[homeAway].teamId != league.teamId);
          const message =
            `Score update for team ${data.team.abbrev}
            Your score: ${data.boxscore[youHomeAway].totalPointsLive}
            Opponent score: ${data.boxscore[oppHomeAway].totalPointsLive}`;
          responder(res, { text: message });
        } else {
          // no boxscore data
          responder(res, { text: data });
        }
      } else {
        // no espn league
        responder(res, { text: "There is no ESPN fantasy league associated with your phone number, add an ESPN league here! www.blah.com" })
      }
    } else {
      // no user exists
      console.log('responding!')
      responder(res, { text: "You are not currently signed up for Fantasy Football Textbot, signup here! www.blah.com" });
    }
  } else {
    res.status(400).json({
      error: "This Fantasy Football Textbot API expected a phone number with the incoming request."
    });
  }
});

module.exports = app;