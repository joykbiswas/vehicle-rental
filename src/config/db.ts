import { Pool } from "pg";
import config from ".";

//DB
export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone VARCHAR(15),
      role VARCHAR(50) NOT NULL
      ) 
    `);

  await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(150) NOT NULL,
      type VARCHAR(100) NOT NULL,
      registration_number VARCHAR(200) UNIQUE NOT NULL,
      daily_rent_price INTEGER NOT NULL,
      availability_status VARCHAR(50) NOT NULL
      )
      `);
  await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings(
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date VARCHAR(250) NOT NULL,
      rent_end_date VARCHAR(250) NOT NULL,
      total_price INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'active'
      )
      `);
};
export default initDB;