import { Pool } from "pg";

// Create a single pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon requires SSL
  },
});

// Generic query function with typing support
export async function query<T = any>(text: string, params?: any[]) {
  const result = await pool.query(text, params);
  return result;
}
