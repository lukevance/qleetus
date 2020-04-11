var fetch = require("node-fetch");

const request = async () => {
    const url = `https://8fqfwnzfyb.execute-api.us-east-1.amazonaws.com/dev/leagues/286565/teams/7/boxscore`;
    const res = await fetch(url);
    const json = await res.json();
    console.log(json);
    return json;
};

request();