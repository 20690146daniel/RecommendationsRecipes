const AWS = require('aws-sdk');


const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'dummy',
  secretAccessKey: 'dummy'
});

module.exports = documentClient;