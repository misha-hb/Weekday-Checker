const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Install with `npm install jsonwebtoken`

const app = express();
const port = 443;

const JWT_SIGNING_SECRET = '02lcEu05_veHppy7_hwFC1MhU3Kc_XZNbU0UmFlORXfDLOaNNYljP3-zzAHohOBWyhnQfAJQytq2KpQSD81ABDrG9ePGagsuZpTZG29x0NWPUHSBbc1iNahR1Qzd_hA8v2LbiAMUIvnAsEH5IlHtWrGkb1dwDWUBlvcDwrFKXbw_0yimjgF4EE6jpNmFz88s8pIqQTygZHfmif4C4MaCxnWrnIC0nsDUZYKM_cm4GgKU9Tt2cHuaia4qG_0fFA2';


app.use(bodyParser.json());

function verifyJwt(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SIGNING_SECRET);
      req.jwtPayload = decoded; // Attach decoded JWT payload for further use
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  }


// Define a GET route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Weekday Checker API. Use POST /execute to check if today is a weekday.');
  });

app.post('/execute', verifyJwt, (req, res) => {
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
