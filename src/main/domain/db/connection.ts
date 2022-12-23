import { Database } from "sqlite3";
import dotenv from "dotenv";

//Cfg dotenv
dotenv.config();

export const connectDatabase = async () => {
  const db = new Database(process.env.DB_FILE || "poc_nova.db", (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  return db as Database;
};
