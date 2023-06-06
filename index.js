require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// it will be an Array of strings where
// Index equals to shortUrl - 1
// And the string will be the original URL
let urlArray = [];

// Basic Configuration
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {

  let url
  try {
    url = new URL(req.body.url);
  } catch {
    return res.json({ error:"Invalid URL" });
  }
  // if (url) console.log(url)
  
  if (urlArray.includes(url)) {
    let shortUrlIndex = urlArray.indexOf(url);
    return res.json({ original_url: url, short_url: shortUrlIndex + 1 });
  }
  else
  {
    let shortUrl = urlArray.push(url);
    return res.json({ original_url: url, short_url: shortUrl });
  }
});

app.get('/api/shorturl/:shorturl', (req, res) => {
  let shUrl = req.params.shorturl;

  console.log(urlArray[shUrl - 1])
  // ERRORs
  if (isNaN(shUrl)) return res.json({ error: 'Wrong format' });
  if (shUrl <= 0)  return res.json({ error: 'Wrong format' });
  if (shUrl > 0 && urlArray[shUrl - 1] === undefined)
    return res.json({ error: "No short URL found for the given input" });
    
  // short url equals to index + 1.
  // so index = shortUrl - 1.
  let url = urlArray[shUrl - 1];
  res.redirect(url);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
