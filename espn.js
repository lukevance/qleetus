const fetch = require('node-fetch');

module.exports.getBoxscore = async (leagueId, teamId) => {
    const request = async () => {
        const url = `https://8fqfwnzfyb.execute-api.us-east-1.amazonaws.com/dev/leagues/${leagueId}/teams/${teamId}/boxscore`;
        const res = await fetch(url);
        const json = await res.json();
        return json;
    }
    return request();
}