

const jwt = require('jsonwebtoken');

const payload = {
    sub: "test-subject",
    iss: "test-issuer",
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
    iat: Math.floor(Date.now() / 1000),
    inArguments: [
        {
            selectedDays: [5, 6] // Days selected
        }
    ]
};

const secret = 'QNW2Fd8Q104b7J3DsqK8msa5dB8EKwpS-vg8-_rz8AEEGtDgc9Uw9LXg1WBom6pv9Nqfdne4RW04EzzpVILxChiZStJWWrFrcNW-x9tU5rmKHJFKaSqvZf6jtU-2AmXBdqOLs_MhQEtmUXVDWFfHQ_1jnFKQZq37ScphfwT3KR310eoBRJBfhcuWb0BWc6P29X6QlaAcafFiI4ndEKfS6BuptdofTWL3aM4wec51sG0vgEOUutZAjDL39dCdyw2';

const token = jwt.sign(payload, secret, { algorithm: 'HS256' });
console.log(token);