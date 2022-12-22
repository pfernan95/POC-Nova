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
/**export const dataSource = new DataSource({
  type: (process.env.DB_CONNECTION || "mysql") as any,
  host: process.env.DB_HOST,
  port: (process.env.DB_PORT || 3306) as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [__dirname + "/../entity/*.{js,ts}"],
  database: process.env.DB_DATABASE,
});

// export const connectDatabase = async () => {
//   if (areWeTestingWithJest()) {
//     dataSource = new DataSource({
//       name: "test",
//       type: "better-sqlite3",
//       database: ":memory:",
//       entities: [__dirname + "/../entity/*.{js,ts}"],
//       synchronize: true,
//     });
//   } else {
//     dataSource = new DataSource({
//       type: (process.env.DB_CONNECTION || "mysql") as any,
//       host: process.env.DB_HOST,
//       port: (process.env.DB_PORT || 3306) as number,
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       entities: [__dirname + "/../entity/*.{js,ts}"],
//       database: process.env.DB_DATABASE,
//     });
//   }
//   await dataSource.initialize();
// };

// const areWeTestingWithJest = () => {
//   return process.env.JEST_WORKER_ID !== undefined;
// };

**/
