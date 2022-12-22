import { Database } from "sqlite3";
import { connectDatabase } from "../../db/connection";
import { User } from "../user";
import { Role } from "../role";
import { v4 } from "uuid";

const db = async () => {
  const dataBase = (await connectDatabase()) as unknown as Database;
  return dataBase;
};

export class UserRepository {
  findById = async (id: string) => {
    const dataBase = await db();
    let user = new User();

    return new Promise((resolve, reject) => {
      dataBase.all(
        `SELECT u.id, u.name, u.surname, u.email, ur.role_id FROM users u JOIN user_roles ur on ur.user_id = u.id WHERE u.id = ?`,
        id,
        (err, rows) => {
          if (err) {
            reject(err);
          }
          const userRoles: Role[] = [];

          rows.forEach((roles) => {
            userRoles.push(roles.role_id);
          });

          user.id = rows[0].id;
          user.name = rows[0].name;
          user.surname = rows[0].surname;
          user.email = rows[0].email;
          user.roles = userRoles;

          dataBase.close();
          resolve(user);
        }
      );
    });
  };

  findByEmail = async (email: string) => {
    const dataBase = await db();
    let user: Partial<User> = new User();

    return new Promise((resolve, reject) => {
      dataBase.get(
        `SELECT u.name, u.surname, u.id, u.email, u.password_hash FROM users u WHERE u.email = ?`,
        email,
        (err, row) => {
          if (err) {
            reject(err);
          }
          if (row) {
            user.id = row.id;
            user.name = row.name;
            user.surname = row.surname;
            user.email = row.email;
            user.password_hash = row.password_hash;
            dataBase.close();
            resolve(user);
          } else {
            resolve(undefined);
          }
        }
      );
    });
  };

  createUser = async (user: User) => {
    const dataBase = await db();

    user.id = v4();

    return new Promise((resolve, reject) => {
      dataBase.run(
        "INSERT INTO users(id, name, surname, email, password_hash) VALUES(?,?,?,?,?)",
        user.id,
        user.name,
        user.surname,
        user.email,
        user.password_hash,
        (err: Error) => {
          if (err) {
            reject(err);
          }

          dataBase.close();
          resolve(user);
        }
      );
    });
  };
}
