const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Install with `npm install jsonwebtoken`

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SIGNING_SECRET = 'QNW2Fd8Q104b7J3DsqK8msa5dB8EKwpS-vg8-_rz8AEEGtDgc9Uw9LXg1WBom6pv9Nqfdne4RW04EzzpVILxChiZStJWWrFrcNW-x9tU5rmKHJFKaSqvZf6jtU-2AmXBdqOLs_MhQEtmUXVDWFfHQ_1jnFKQZq37ScphfwT3KR310eoBRJBfhcuWb0BWc6P29X6QlaAcafFiI4ndEKfS6BuptdofTWL3aM4wec51sG0vgEOUutZAjDL39dCdyw2';


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
    console.log('Authorization Header:', req.headers.authorization);

});

app.listen(PORT, () => {
  console.log(`Custom Activity app listening on port ${PORT}`);
});
