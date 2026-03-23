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
        console.log("LOGGING IN...");
        const loginRes = await request('POST', '/api/auth/login', {}, JSON.stringify({ email: 'bda@acadeno.com', password: 'Test@1234' }));
        const token = JSON.parse(loginRes.data).accessToken;
        
        console.log("FETCHING DASHBOARD...");
        const dashRes = await request('GET', '/api/leads/dashboard', { 'Authorization': `Bearer ${token}` });
        console.log("DASHBOARD STATUS:", dashRes.status, "DATA:", dashRes.data);
    } catch (e) {
        console.error("DIAGNOSTIC ERROR:", e.message);
    }
})();
