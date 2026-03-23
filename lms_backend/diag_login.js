const axios = require('axios');

(async () => {
    try {
        console.log("TESTING BDA LOGIN...");
        try {
            const resBda = await axios.post('http://localhost:3001/api/auth/login', {
                email: 'bda@acadeno.com',
                password: 'Test@1234'
            });
            console.log("BDA LOGIN SUCCESS:", resBda.data.user.role);
        } catch (err) {
            console.log("BDA LOGIN FAIL:", err.response?.status, err.response?.data);
        }

        console.log("\nTESTING ADMIN LOGIN...");
        try {
            const resAdmin = await axios.post('http://localhost:3001/api/auth/login', {
                email: 'admin@acadeno.com',
                password: 'Admin123!'
            });
            console.log("ADMIN LOGIN SUCCESS:", resAdmin.data.user.role);
        } catch (err) {
            console.log("ADMIN LOGIN FAIL:", err.response?.status, err.response?.data);
        }
    } catch (err) {
        console.error("DIAGNOSTIC ERROR:", err.message);
    }
})();
