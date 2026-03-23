const http = require('http');

const request = (method, path, headers = {}, body = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path,
            method,
            headers
        };
        if (body) {
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = Buffer.byteLength(body);
        }

        const req = http.request(options, (res) => {
            let resBody = '';
            res.on('data', (chunk) => resBody += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: resBody }));
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(body);
        req.end();
    });
};

(async () => {
    try {
        console.log("TESTING BDA LOGIN & ME...");
        const bdaLogin = await request('POST', '/api/auth/login', {}, JSON.stringify({ email: 'bda@acadeno.com', password: 'Test@1234' }));
        const bdaToken = JSON.parse(bdaLogin.data).accessToken;
        const bdaMe = await request('GET', '/api/auth/me', { 'Authorization': `Bearer ${bdaToken}` });
        console.log("BDA ME STATUS:", bdaMe.status, "DATA:", bdaMe.data);

        console.log("\nTESTING ADMIN LOGIN & ME...");
        const adminLogin = await request('POST', '/api/auth/login', {}, JSON.stringify({ email: 'admin@acadeno.com', password: 'Admin123!' }));
        const adminToken = JSON.parse(adminLogin.data).accessToken;
        const adminMe = await request('GET', '/api/auth/me', { 'Authorization': `Bearer ${adminToken}` });
        console.log("ADMIN ME STATUS:", adminMe.status, "DATA:", adminMe.data);
    } catch (e) {
        console.error("TEST ERROR:", e.message);
    }
})();
