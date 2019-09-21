const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const TABLE_NAME = process.env.DB_TABLENAME;
// const env = require('./.env.json');
// const TABLE_NAME = env.DB_TABLENAME;

const getUser = async fromNumber => {
    const user = await dynamoDb
        .get({ 
            TableName: TABLE_NAME,
            Key:{
                "phoneNumber": fromNumber,
            }
        })
        .promise()
        .then(response => {
            const matchingUser = response.Item;
            return matchingUser;
        })
        .catch(err => {
            return err;
        });
    return user;
};

const getUserLeagues = async fromNumber => {
    const user = await getUser(fromNumber);
    return user.leagues;
};

module.exports = {
    getUser,
    getUserLeagues
};