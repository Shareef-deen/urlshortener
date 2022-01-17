require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const dns = require('dns');
const urlparser = require('url');
const {Schema} = mongoose;
const app = express();

// Basic Configuration
//console.log(process.env.DB_URI)
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const port = process.env.PORT || 3000;

const schema = new Schema({url: String});
const Url = mongoose.model("url", schema);

app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.post('/api/shorturl',  (req, res)=>{
console.log(req.body);
const bodyurl = req.body.url

const something = dns.lookup(urlparser.parse(bodyurl).hostname,async (err, address)=>{

  if(!address){

    res.json({error: "invalid url"});

  }else {

    const url = new Url({url: bodyurl})

    url.save((err, data)=>{

res.json({original_url: data.url, short_url: data.id})

})
  }
  console.log("dns", error);
  console.log("address", address);
})
console.log("something",something);
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
