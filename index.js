require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
let urlDatabase = {}; // Menyimpan original URL
let idCounter = 1;

// Endpoint untuk memendekkan URL
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  console.log(req.body);

  // Validasi URL menggunakan ekspresi reguler
  const urlPattern = /^(https?:\/\/)(www\.)?[^\s/$.?#].[^\s]*$/;
  if (!urlPattern.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  const originalUrl = url;
  const shortUrl = idCounter++;

  // Simpan original URL ke database sementara
  urlDatabase[shortUrl] = originalUrl;

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Endpoint untuk redirect ke original URL
app.get('/api/shorturl/:id', (req, res) => {
  const { id } = req.params;
  const longUrl = urlDatabase[id];

  if (longUrl) {
    return res.redirect(longUrl); // Redirect ke URL asli
  }

  res.status(404).json({ error: 'URL tidak ditemukan' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
