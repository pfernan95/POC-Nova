import { Database } from "sqlite3";
import { connectDatabase } from "../../db/connection";
import { Role } from "../role";
import { v4 } from "uuid";
import { Nomination } from "../nomination";
import { resolve } from "path";

const db = async () => {
  const dataBase = (await connectDatabase()) as unknown as Database;
  return dataBase;
};

export class NominationRepository {
  findByEmail = async (email: string) => {
    const dataBase = await db();
    let nomination: Partial<Nomination> = new Nomination();

    return new Promise((resolve, reject) => {
      dataBase.get(
        `SELECT n.email from nominations n where n.email = ?`,
        email,
        (err, row) => {
          if (err) {
            reject(err);
          }
          if (row) {
            nomination.email = row.email;
            dataBase.close();
            resolve(nomination);
          } else {
            resolve(undefined);
          }
        }
      );
    });
  };

  createNomination = async (nomination: Nomination) => {
    const dataBase = await db();

    nomination.id = v4();

    return new Promise((resolve, reject) => {
      dataBase.run(
        "INSERT INTO nominations(id, name, surname, email, description, involvement, overall, status, user_id) VALUES(?,?,?,?,?,?,?,?,?)",
        nomination.id,
        nomination.name,
        nomination.surname,
        nomination.email,
        nomination.description,
        nomination.involvement,
        nomination.overall,
        nomination.status,
        nomination.user_id,
        (err: Error) => {
          if (err) {
            reject(err);
          }

          dataBase.close();
          resolve(nomination);
        }
      );
    });
  };

  getAcceptedNominations = async () => {
    const dataBase = await db();
    return new Promise((resolve, reject) => {
      dataBase.all(
        'SELECT n.id, n.name, n.surname, n.email, n.description, n.involvement, n.overall, u.email AS user_email FROM nominations n JOIN users u ON n.user_id = u.id WHERE status = "ACCEPTED"',
        (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
          dataBase.close();
        }
      );
    });
  };
}
