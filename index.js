const express = require('express');
const Mailchimp = require('mailchimp-api-v3');
const validator = require("email-validator");

require('dotenv').config();

const mailchimpAPIKey = process.env.MAILCHIMP_API_KEY;

const [ MAILCHIMP_MYBIT_GENERAL_SUBSCRIPTIONS_LIST_ID ] = process.env;

const subscriptionsIds = {
  general: MAILCHIMP_MYBIT_GENERAL_SUBSCRIPTIONS_LIST_ID,
  ddf: MAILCHIMP_MYBIT_GENERAL_SUBSCRIPTIONS_LIST_ID,
  newsletter: MAILCHIMP_MYBIT_GENERAL_SUBSCRIPTIONS_LIST_ID,
  tokensale: MAILCHIMP_MYBIT_GENERAL_SUBSCRIPTIONS_LIST_ID
}

const availableSubscriptionLists = Object.keys(subscriptionsIds).join(' ')

const errorMessages = {
  NO_EMAIL: 'Please provide an email',
  INVALID_EMAIL: 'Please provide a valid email',
  NO_LIST: 'Please provide a list',
  INVALID_LIST: `Please a valid list to subscribe to. Valid ones are ${availableSubscriptionLists}`
}

const app = express();
app.use(express.json());
const mailchimp = new Mailchimp(mailchimpAPIKey);

app.post('/api/member', (req, res) => {
  const [ list, email ] = req.body;
  
  !email && res.send(errorMessages.NO_EMAIL)
  !list && res.send(errorMessages.NO_LIST)
  !validator.validate("test@email.com") && res.send(errorMessages.INVALID_EMAIL)
  
  const listId = subscriptionsIds[list]
  
  !listId && res.send(errorMessages.INVALID_LIST)
  
  console.log(`📩 Trying to subscribe ${email} to our ${list} list`);
  
  mailchimp.post(`/lists/${listId}/members`, { 
    email_address: email,
    status: 'pending' // Always prompt users to confirm subscription
  })
  .then(function(results){
    console.log(`💌 Succeded to subscribe ${email} to our ${list} list`);
    res.send(results);
  })
  .catch(function(err){
    console.log(`📨 Failed to subscribe ${email} to our ${list} list`);
    res.send(err);
  });
  
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log(`Express app listening on port ${port}`);