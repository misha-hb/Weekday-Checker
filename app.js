const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 443;
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

const SFMC_SECRET = "U84_UGVwv5yiXWxlXpd-BxIVw60AWdjbS3hXVZd_21ELc4gW2nXbeej8NgK6-8ZESzk7rqEfyuhVkjM26H_SOwiVjVXJB-dPKkr4gtuKU8KLB5K6IkDPkwAn8rV1Uy89_ujCixNKCpOJgmYtXJlUUwcvLpefaN4mRO-pUhBXz2O-ZIYqFbjHhaKqMrFMJMXMrfPp7-8dlskvncJVFMcs4uEYwbelECoMWgsX0-oV_I4VGfkNS4uQrdjgXz-BKg2";

function validateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"

    jwt.verify(token, SFMC_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Token is valid, attach decoded payload to request
        req.decoded = decoded;
        next();
    });
}


// Define a GET route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Weekday Checker API. Use POST /execute to check if today is a weekday.');
  });

app.post('/execute', validateJWT, (req, res) => {
    const today = new Date();
    const day = today.getDay();
    const isWeekday = day >= 1 && day <= 5;
    res.setHeader('Content-Type', 'application/json');

    res.json({
        sendEmail: isWeekday
    });
});

app.listen(port, () => {
  console.log(`Custom Activity app listening on port ${port}`);
});
