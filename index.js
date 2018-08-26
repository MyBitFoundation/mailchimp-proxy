const express = require('express');
const Mailchimp = require('mailchimp-api-v3');
require('dotenv').config();

const mailchimpAPIKey = process.env.MAILCHIMP_API_KEY;

const app = express();
const mailchimp = new Mailchimp(mailchimpAPIKey);

app.get('/api/memberList', (req, res) => {
  const listId = req.body.listId;
  
  mailchimp.get(`/lists/${listId}/members`)
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