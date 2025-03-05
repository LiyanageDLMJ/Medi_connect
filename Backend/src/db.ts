import { createPool } from 'mysql';

const pool = createPool({
  host: 'localhost',
  user: 'root',       
  password: '',      
  database: 'example_app', 
  connectionLimit: 10,
});

export default pool;