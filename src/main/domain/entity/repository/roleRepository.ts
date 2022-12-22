import { Role } from "../role";
import { Database } from "sqlite3";
import { connectDatabase } from "../../db/connection";

const db = async () => {
  const dataBase = (await connectDatabase()) as unknown as Database;
  return dataBase;
};

export class RoleRepository {
  checkRolesExists = async (ids: number[]) => {
    const dataBase = await db();
    const userRoles: Role[] = [];

    return new Promise((resolve, reject) => {
      dataBase.all(
        `SELECT * FROM roles r WHERE r.id IN (?,?)`,
        ids,
        (err, rows) => {
          if (err) {
            reject(err);
          }

          const userRole: Role = new Role();

          rows.forEach((role) => {
            (userRole.id = role.id), (userRole.role = role.role);
            userRoles.push(userRole);
          });
        }
      );
      dataBase.close();
      resolve(userRoles);
    });
  };
}
