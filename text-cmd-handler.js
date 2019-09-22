'use strict';
const R = require('ramda');
const { getUser } = require('./users');
const { getBoxscore } = require('./espn');

module.exports.scoreUpdateSummaryText = async (fromNumber) => {
    const user = await getUser(fromNumber);
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
          const message =`Score update for team ${data.team.abbrev}
          Your score: ${data.boxscore[youHomeAway].totalPointsLive}
          Opponent score: ${data.boxscore[oppHomeAway].totalPointsLive}`;
          return {text: message};
        } else {
          // no boxscore data
          return data;
        }
      } else {
        // no espn league
        return { text: "There is no ESPN fantasy league associated with your phone number, add an ESPN league here! www.blah.com" };
      }
    } else {
      // no user exists
      return { text: "You are not currently signed up for Fantasy Football Textbot, signup here! www.blah.com" };
    }
};

module.exports.scoreUpdateDetails = async (fromNumber) => {
  const user = await getUser(fromNumber);
    // check that user was returned
    if (user) {
      const league = user.leagues ? user.leagues.find(league => league.provider === "espn") : null;
      // check that user has an espn league
      if (league) {
        // user exists and has ESPN league
        // GET TO BUSINESS!!
        const data = await getBoxscore(league.id, league.teamId);
        const youHomeAway = ["home", "away"].find(homeAway => data.boxscore[homeAway].teamId == league.teamId);
        const oppHomeAway = ["home", "away"].find(homeAway => data.boxscore[homeAway].teamId != league.teamId);
        const yourActivePlayers = data.boxscore[youHomeAway].rosterForCurrentScoringPeriod.entries.filter(plyr => plyr.lineupSlotId != 20);
        const diff = (a, b) => a.lineupSlotId - b.lineupSlotId;
        const orderedPlayers = R.sort(diff, yourActivePlayers);
        const activePlayersSummary = orderedPlayers.map(plyr => `${plyr.playerPoolEntry.player.fullName}: ${plyr.playerPoolEntry.appliedStatTotal}`);
        return {
          text: activePlayersSummary.join("\n")
        };
      } else {
        // no espn league
        return { text: "There is no ESPN fantasy league associated with your phone number, add an ESPN league here! www.blah.com" };
      }
    } else {
      // no user exists
      return { text: "You are not currently signed up for Fantasy Football Textbot, signup here! www.blah.com" };
    }
};