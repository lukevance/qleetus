'use strict';

const serverless = require('serverless-http');

const app = require("./app");
const appHandler = serverless(app);

module.exports = { appHandler };