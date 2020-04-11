# Qleetus
### A Chatbot for Fantasy Football Score Updates

Fantasy football can get intense. I get it. But for the days when you're not sitting by your TV, don't be the friend at the park who can't stop refreshing the app on your smartphone. Instead text Qleetus for updates, stay calm and keep your head in the game (kind of).  

## Getting Started

Sign up with your league here!

Or spin up your own with Twilio, Serverless and DynamoDB.

### Prerequisites

Get a free [Twilio account](www.twilio.com/referral/uzRDAF) and get a free phone number for your first 6 months.

Sign up for a trial account of [Amazon Web Services](https://aws.amazon.com/free/) if you don't already have one.

Install Serverless Framework, you won't need an account, but it's free and can be helpful.

```
npm install -g serverless
```

Finally, configure serverless with credentials for AWS, they have a (helpful guide)[https://serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/].


### Installing

Install npm dependencies:

```
npm install
```

Use the AWS-CLI or go to your AWS account and [set up a DynamoDB table](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-1.html), then add a `.env.json` file to your project using the included sample (remember not to commit your real one!)

## Deployment

From there it's as simple as:

```
serverless deploy
```
Tada, you're up and running!

## Contributing

Feel free to fork and submit a PR, no rules or expectations! But please understand that this project is not professionally maintained so there may be delays in responses.

## Authors

* Me, Luke Vance

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [Serverless](https://serverless.com/) is awesome and makes things like this super easy!
* [Twilio's](https://www.twilio.com/docs) training material and documentation is 2nd to none, thank yoU!
