import Database from "bun:sqlite";
import { config } from "dotenv";

config({ path: ".env" });

const db = new Database("db.sqlite");

db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            username TEXT
        )
    `).all();

db.query(`
    CREATE TABLE IF NOT EXISTS register_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        username TEXT
    )
    `).all();

if (
  db
    .prepare(
      `SELECT * FROM users WHERE user_id = ${Number(process.env.OWNER_ID)}`
    )
    .all().length === 0
) {
  db.query(
    `INSERT INTO users (user_id, username) VALUES (${Number(
      process.env.OWNER_ID
    )}, '${process.env.OWNER_USERNAME}')`
  );
}

export default db;
