const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); 
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SIGNING_SECRET = 'QNW2Fd8Q104b7J3DsqK8msa5dB8EKwpS-vg8-_rz8AEEGtDgc9Uw9LXg1WBom6pv9Nqfdne4RW04EzzpVILxChiZStJWWrFrcNW-x9tU5rmKHJFKaSqvZf6jtU-2AmXBdqOLs_MhQEtmUXVDWFfHQ_1jnFKQZq37ScphfwT3KR310eoBRJBfhcuWb0BWc6P29X6QlaAcafFiI4ndEKfS6BuptdofTWL3aM4wec51sG0vgEOUutZAjDL39dCdyw2';

// Enable CORS
app.use(cors());

// Serve static files correctly from `public/`
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   if (req.url.endsWith('.js')) {
//     res.setHeader('Content-Type', 'application/javascript');
//   }
//   next();
// })

// app.get('/customActivity.js', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'customActivity.js'));
// });

// app.get('/js/postmonger.js', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'js', 'postmonger.js'));
// });


// // Serve `config.json`
app.get('/config.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'config.json'));
});



// JWT verification middleware
function verifyJwt(req, res, next) {
  if (req.headers['content-type'] === 'application/jwt') {
    try {
      const rawJwt = req.body.toString();
      const decoded = jwt.verify(rawJwt, JWT_SIGNING_SECRET);
      req.jwtPayload = decoded;
      next();
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } else {
    res.status(400).json({ error: 'Unsupported Content-Type' });
  }
}

// Execute Route
app.post('/execute', verifyJwt, (req, res) => {

  function getClosestDate(selectedDays, currentDate) {
    const currentDayOfWeek = currentDate.getDay();
    let closestDate = new Date(currentDate);

    let minDaysDifference = 7;
    let closestDay = null;

    for (const selectedDay of selectedDays) {
      let difference = selectedDay - currentDayOfWeek;
      if (difference < 0) {
        difference += 7;
      }

      if (difference < minDaysDifference) {
        minDaysDifference = difference;
        closestDay = new Date(currentDate);
        closestDay.setDate(currentDate.getDate() + difference);
      }
    }

    return closestDay;
  }

  // Custom formatting function for the desired format
  function formatDate(date) {
    const options = { year: '2-digit', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = date.toLocaleString('en-US', options);

    // Adjust format to "MMM-DD-YY 11:59 PM"
    const [month, day, year, time, period] = formattedDate.split(/[\s,]+/);
    const shortYear = year.slice(2);  // Take last two digits of the year
    return `${month}-${day}-${shortYear} ${time} ${period}`;
  }

  console.log('✅ Request received at /execute:', req.body);

  const today = new Date();
  const inArguments = req.jwtPayload?.inArguments || [];

  if (!Array.isArray(inArguments) || inArguments.length === 0) {
    //console.error('❌ No inArguments provided');
    inArguments = [{ selectedDays: [0, 1, 2, 3, 4, 5, 6] }];
  }

  const selectedDays = inArguments[0].selectedDays || [];

  const closestDate = getClosestDate(selectedDays, today);

  // Set the time to 11:59 PM
  closestDate.setHours(23);
  closestDate.setMinutes(59);
  closestDate.setSeconds(0);
  closestDate.setMilliseconds(0);

  const formattedDate = formatDate(closestDate);

  res.json({ closestDate: formattedDate });


  console.log('📩 Send Email:', closestDate);
});

// Save Route
app.post('/save', (req, res) => {
  console.log('✅ Save request received:', req.body);
  res.json({ success: true });
});

// Publish Route
app.post('/publish', (req, res) => {
  console.log('✅ Publish request received:', req.body);
  res.json({ success: true });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Custom Activity app listening on port ${PORT}`);
});