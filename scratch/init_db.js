import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
  console.log('Connecting to PostgreSQL on 127.0.0.1:5432...');

  const dbPassword = process.env.PGPASSWORD || 'postgres';
  const rootUrl = `postgresql://postgres:${encodeURIComponent(dbPassword)}@127.0.0.1:5432/postgres`;
  const rootClient = new pg.Client({ connectionString: rootUrl });

  try {
    await rootClient.connect();
    console.log('✅ Connected to postgres server!');

    // Set postgres user password explicitly so SCRAM-SHA-256 authentication works seamlessly
    await rootClient.query("ALTER USER postgres WITH PASSWORD 'postgres'");
    console.log("✅ Set postgres user password to 'postgres'.");

    // Check / Create learnsphere_db
    const res = await rootClient.query("SELECT 1 FROM pg_database WHERE datname = 'learnsphere_db'");
    if (res.rowCount === 0) {
      console.log('Creating database learnsphere_db...');
      await rootClient.query('CREATE DATABASE learnsphere_db');
      console.log('✅ Database learnsphere_db created!');
    } else {
      console.log('ℹ️ Database learnsphere_db already exists.');
    }
  } catch (err) {
    console.error('❌ Error during root connection/setup:', err);
    process.exit(1);
  } finally {
    await rootClient.end();
  }

  // Connect to learnsphere_db
  const appDbUrl = `postgresql://postgres:postgres@127.0.0.1:5432/learnsphere_db`;
  const appClient = new pg.Client({ connectionString: appDbUrl });

  try {
    await appClient.connect();
    console.log('✅ Connected to learnsphere_db database!');

    const schemaPath = path.resolve('database/schema.sql');
    const seedPath = path.resolve('database/seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Applying database/schema.sql...');
    await appClient.query(schemaSql);
    console.log('✅ Schema created successfully!');

    console.log('Applying database/seed.sql...');
    await appClient.query(seedSql);
    console.log('✅ Seed data inserted successfully!');

    // Verification Query
    const counts = await appClient.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) AS users_count,
        (SELECT COUNT(*) FROM users WHERE role = 'Student') AS students_count,
        (SELECT COUNT(*) FROM users WHERE role = 'Faculty') AS faculty_count,
        (SELECT COUNT(*) FROM courses) AS courses_count,
        (SELECT COUNT(*) FROM course_enrollments) AS enrollments_count,
        (SELECT COUNT(*) FROM course_modules) AS modules_count,
        (SELECT COUNT(*) FROM lessons) AS lessons_count,
        (SELECT COUNT(*) FROM assignments) AS assignments_count,
        (SELECT COUNT(*) FROM assignment_submissions) AS submissions_count,
        (SELECT COUNT(*) FROM quizzes) AS quizzes_count,
        (SELECT COUNT(*) FROM quiz_questions) AS questions_count,
        (SELECT COUNT(*) FROM quiz_attempts) AS attempts_count,
        (SELECT COUNT(*) FROM achievements) AS achievements_count,
        (SELECT COUNT(*) FROM announcements) AS announcements_count,
        (SELECT COUNT(*) FROM academic_events) AS events_count,
        (SELECT COUNT(*) FROM certificates) AS certs_count,
        (SELECT COUNT(*) FROM resource_library) AS resources_count
    `);

    console.log('\n==================================================');
    console.log('📊 DATABASE VERIFICATION SUMMARY');
    console.log('==================================================');
    console.table(counts.rows[0]);

    // Save .env and .env.example
    const envContent = `PORT=5000\nDATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/learnsphere_db\nJWT_SECRET=learnsphere_super_secret_jwt_key_2026\n`;
    fs.writeFileSync('.env', envContent);
    fs.writeFileSync('.env.example', `PORT=5000\nDATABASE_URL=postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/learnsphere_db\nJWT_SECRET=your_jwt_secret_key\n`);
    console.log('✅ Created .env and .env.example configuration files.');

    // Revert pg_hba.conf back to scram-sha-256
    const hbaPath = 'C:\\Program Files\\PostgreSQL\\17\\data\\pg_hba.conf';
    if (fs.existsSync(hbaPath)) {
      let hbaContent = fs.readFileSync(hbaPath, 'utf8');
      hbaContent = hbaContent.replace('host    all             all             127.0.0.1/32            trust', 'host    all             all             127.0.0.1/32            scram-sha-256');
      fs.writeFileSync(hbaPath, hbaContent);
      console.log('🔒 Reverted pg_hba.conf to scram-sha-256 method.');
    }

  } catch (err) {
    console.error('❌ Error initializing learnsphere_db:', err);
    process.exit(1);
  } finally {
    await appClient.end();
  }
}

initDatabase();
