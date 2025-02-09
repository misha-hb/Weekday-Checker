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

// Serve `config.json`
app.get('/config.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'config.json'));
});

// Debug: List all files in `/public`
app.get('/debug-files', (req, res) => {
  fs.readdir(path.join(__dirname, 'public'), (err, files) => {
    if (err) {
      console.error('Error reading directory:', err.message);
      return res.status(500).send('Internal Server Error');
    }
    res.json(files);
  });
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
  console.log('✅ Request received at /execute:', req.body);

  const today = new Date();
  const day = today.getDay();
  const inArguments = req.jwtPayload?.inArguments || [];

  if (!Array.isArray(inArguments) || inArguments.length === 0) {
    console.error('❌ No inArguments provided');
    return res.status(400).json({ error: 'No inArguments provided' });
  }

  const selectedDays = inArguments[0].selectedDays || [];
  const sendEmail = selectedDays.includes(day);

  res.json({ sendEmail });

  console.log('📩 Send Email:', sendEmail);
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

// const express = require('express');
// const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken'); // Install with `npm install jsonwebtoken`
// const path = require('path');
// const fs = require('fs'); // Include the fs module
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const JWT_SIGNING_SECRET = 'QNW2Fd8Q104b7J3DsqK8msa5dB8EKwpS-vg8-_rz8AEEGtDgc9Uw9LXg1WBom6pv9Nqfdne4RW04EzzpVILxChiZStJWWrFrcNW-x9tU5rmKHJFKaSqvZf6jtU-2AmXBdqOLs_MhQEtmUXVDWFfHQ_1jnFKQZq37ScphfwT3KR310eoBRJBfhcuWb0BWc6P29X6QlaAcafFiI4ndEKfS6BuptdofTWL3aM4wec51sG0vgEOUutZAjDL39dCdyw2';

// app.use(cors());

// app.use((req, res, next) => {
//   if (req.url.endsWith('.js')) {
//     res.setHeader('Content-Type', 'application/javascript');
//   }
//   next();
// });


// // Middleware to force MIME type for .js files
// app.use((req, res, next) => {
//   if (req.url.endsWith('.js')) {
//     res.setHeader('Content-Type', 'application/javascript');
//   }
//   next();
// });

// app.use(bodyParser.json());
// app.use(require('body-parser').raw({
//   type: 'application/jwt'
// }));

// // JWT verification middleware
// function verifyJwt(req, res, next) {
//   if (req.headers['content-type'] === 'application/jwt') {
//     try {
//       const rawJwt = req.body.toString(); // Convert Buffer to string
//       const decoded = jwt.verify(rawJwt, JWT_SIGNING_SECRET);
//       req.jwtPayload = decoded; // Attach decoded JWT payload for further use
//       next();
//     } catch (err) {
//       console.error('JWT verification failed:', err.message);
//       return res.status(401).json({ error: 'Invalid or expired token' });
//     }
//   } else {
//     res.status(400).json({ error: 'Unsupported Content-Type' });
//   }
// }

// // Serve static files (like index.html and customactivity.js)
// app.use(express.static(path.join(__dirname)));

// // Root route serving index.html
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.get('/config.json', (req, res) => {
//   res.sendFile(path.join(__dirname, 'config.json'));
// });

// // Debug route to list all files in the directory
// app.get('/debug-files', (req, res) => {
//   fs.readdir(__dirname, (err, files) => {
//     if (err) {
//       console.error('Error reading directory:', err.message);
//       return res.status(500).send('Internal Server Error');
//     }
//     res.json(files); // Return the list of files as JSON
//   });
// });

// // Execute route
// app.post('/execute', (req, res) => {
//   console.log('Request received at /execute:', req.body);

//   const today = new Date();
//   const day = today.getDay();

//   const inArguments = req.body.inArguments || [];

//     if (!Array.isArray(inArguments) || inArguments.length === 0) {
//         console.error('No inArguments provided');
//         return res.status(400).json({ error: 'No inArguments provided' });
//     }

//   const selectedDays = inArguments[0].selectedDays || [];
//   const waitTimes = inArguments[0].waitTimes || {};
  

//   // Check if today is one of the selected days
//   const sendEmail = selectedDays.includes(day);

//   res.setHeader('Content-Type', 'application/json');
//   res.json({ sendEmail });

//   console.log('Decoded JWT Payload:', req.jwtPayload);
//   console.log('Selected Days:', selectedDays);
//   console.log('Send Email:', sendEmail);
// });

// app.post('/save', (req, res) => {
//   console.log('✅ Save request received:', req.body);
//   res.json({ success: true });
// });

// // Publish the custom activity (called when journey is activated)
// app.post('/publish', (req, res) => {
//   console.log('✅ Publish request received:', req.body);
//   res.json({ success: true });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Custom Activity app listening on port ${PORT}`);
//   console.log('Serving static files from:', path.join(__dirname));
// });
