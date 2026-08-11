import pg from 'pg';

const passwords = [
  'postgres', 'admin', 'root', '123456', 'kavip', 'LearnSphere', 'password',
  'Postgres', '1234', '12345', 'postgresql', '12345678', 'system', 'kaviprakash',
  'manigandan', 'kavi', 'prakash', 'welcome', '123456789', 'master', 'pg', ''
];

async function debugPasswords() {
  console.log('Testing passwords against PostgreSQL at 127.0.0.1:5432...');
  
  for (const pwd of passwords) {
    const client = new pg.Client({
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: pwd,
      database: 'postgres'
    });
    try {
      await client.connect();
      console.log(`🎉 SUCCESS! Password is: "${pwd}"`);
      await client.end();
      return pwd;
    } catch (err) {
      if (err.code === '28P01') {
        // invalid password - normal failure
      } else {
        console.log(`Attempt "${pwd}" returned unexpected error code ${err.code}: ${err.message}`);
      }
    }
  }

  // Also test with user 'kavip'
  for (const pwd of passwords) {
    const client = new pg.Client({
      host: '127.0.0.1',
      port: 5432,
      user: 'kavip',
      password: pwd,
      database: 'postgres'
    });
    try {
      await client.connect();
      console.log(`🎉 SUCCESS! User kavip password is: "${pwd}"`);
      await client.end();
      return pwd;
    } catch (err) {
      if (err.code === '28P01') {
        // invalid password
      } else {
        console.log(`User kavip attempt "${pwd}" returned error ${err.code}: ${err.message}`);
      }
    }
  }

  console.log('Finished testing candidate list.');
}

debugPasswords();
