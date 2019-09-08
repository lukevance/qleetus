'use strict';
const fetch = require('node-fetch');

// generate twilio response
const responder = (res, data) => {
  const twiml = new MessagingResponse();
  twiml.message(data.text);
  // console.log('sent:', twiml.toString());
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
  // return twiml;
};

module.exports.ping = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.textReceiver = async event => {

}