const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();

app.use(express.static('public'));

https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}, app).listen(3000, () => console.log('Server running on https://localhost:3000'));