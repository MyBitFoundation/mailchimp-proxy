const express = require('express');
const Mailchimp = require('mailchimp-api-v3');
require('dotenv').config();

const mailchimpAPIKey = process.env.MAILCHIMP_API_KEY;
const listId = process.env.MAILCHIMP_LIST_ID;

const app = express();
app.use(express.json());
const mailchimp = new Mailchimp(mailchimpAPIKey);

app.post('/api/member', (req, res) => {
  console.log('Calling ID', listId)
  mailchimp.post(`/lists/${listId}/members`, req.body)
  .then(function(results){
    res.send(results);
  })
  .catch(function(err){
    res.send(err);
  });
  
});

const port = process.env.PORT || 9001;
app.listen(port);

console.log(`Express app listening on port ${port}`);