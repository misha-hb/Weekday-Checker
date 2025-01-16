const jwt = require('jsonwebtoken');

// Define the payload
const payload = {
    sub: "test-subject",
    iss: "test-issuer",
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // Expires in 1 hour
};

// Define the secret key (same as in your app.js)
const secretKey = 'QNW2Fd8Q104b7J3DsqK8msa5dB8EKwpS-vg8-_rz8AEEGtDgc9Uw9LXg1WBom6pv9Nqfdne4RW04EzzpVILxChiZStJWWrFrcNW-x9tU5rmKHJFKaSqvZf6jtU-2AmXBdqOLs_MhQEtmUXVDWFfHQ_1jnFKQZq37ScphfwT3KR310eoBRJBfhcuWb0BWc6P29X6QlaAcafFiI4ndEKfS6BuptdofTWL3aM4wec51sG0vgEOUutZAjDL39dCdyw2';

// Generate the token
const token = jwt.sign(payload, secretKey);

console.log("Generated JWT:", token);