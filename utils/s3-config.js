const aws = require('aws-sdk');

aws.config.update({
    // Your SECRET ACCESS KEY from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
    secretAccessKey: "/vY0GqG9ZUMx7O61VVlq75bhGdwTkAolY4gZUCyr",
    // Not working key, Your ACCESS KEY ID from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
    accessKeyId: "AKIAWYR7KDADVJTXLNWJ",
    region: 'eu-central-1', // region of your bucket
    apiVersion: '2006-03-01'
});

export const s3 = new aws.S3();