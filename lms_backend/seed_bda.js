require('dotenv').config();
const { query } = require('./src/db/index');

async function seedBdaUser() {
  try {
    const email = 'bda@acadeno.com';
    const passwordHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGqAkQjFuoFkQZBl1bIJRvLKTOa';
    
    // Use super_admin role to bypass RLS for seeding
    const check = await query('SELECT id FROM users WHERE email = $1', [email], 'super_admin');
    if (check.rows.length > 0) {
      console.log('BDA user already exists.');
      process.exit(0);
    }

    await query(
      `INSERT INTO users (email, password_hash, role, is_active, mfa_enabled) 
       VALUES ($1, $2, 'bda', true, false)`,
      [email, passwordHash],
      'super_admin'
    );
    console.log('✅ BDA user created successfully: bda@acadeno.com / Test@1234');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding BDA user:', err.message);
    process.exit(1);
  }
}

seedBdaUser();
