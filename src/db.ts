import { Pool } from 'pg';

const pool = new Pool({
  user: 'sytnikov',
  host: 'localhost',
  database: 'hsl-data',
  password: '2503',
  port: 5432,
});

export default pool;