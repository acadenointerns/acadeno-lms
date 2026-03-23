const http = require('http');

const login = (email, password) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ email, password });
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: body }));
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

(async () => {
    try {
        console.log("TESTING BDA LOGIN...");
        const bda = await login('bda@acadeno.com', 'Test@1234');
        console.log("BDA STATUS:", bda.status, "DATA:", bda.data);

        console.log("\nTESTING ADMIN LOGIN...");
        const admin = await login('admin@acadeno.com', 'Admin123!');
        console.log("ADMIN STATUS:", admin.status, "DATA:", admin.data);
    } catch (e) {
        console.error("TEST ERROR:", e.message);
    }
})();
