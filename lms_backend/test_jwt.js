require('dotenv').config();
const jwt = require('jsonwebtoken');

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n');
const PUBLIC_KEY  = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n');

console.log("PRIVATE_KEY LOADED:", !!PRIVATE_KEY);
console.log("PUBLIC_KEY LOADED:", !!PUBLIC_KEY);

try {
    const token = jwt.sign({ test: 'data' }, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '1h' });
    console.log("TOKEN SIGNED SUCCESS");
    const decoded = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    console.log("TOKEN VERIFIED SUCCESS:", decoded);
} catch (err) {
    console.error("JWT ERROR:", err.message);
    if (PRIVATE_KEY) console.log("PRIVATE_KEY START:", PRIVATE_KEY.substring(0, 30));
}
