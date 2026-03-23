const { pool } = require('./src/db/index');
(async () => {
  try {
    // List tables
    const tables = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    console.log("TABLES_JSON: " + JSON.stringify(tables.rows, null, 2));

    const res = await pool.query("SELECT id, email, role, is_active FROM users");
    console.log("USERS_JSON: " + JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("DB Query Error:", err.message);
    process.exit(1);
  }
})();
