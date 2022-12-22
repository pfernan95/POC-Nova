import { Database } from "sqlite3";
import { connectDatabase } from "../../db/connection";
import { v4 } from "uuid";

const db = async () => {
  const dataBase = (await connectDatabase()) as unknown as Database;
  return dataBase;
};

export class UserRoleRepository {
  createUserRole = async (userId: string, roleIds: number[]) => {
    const dataBase = await db();
    const sql =
      `INSERT INTO user_roles (id, user_id, role_id) VALUES` +
      roleIds.map(() => "(?, ?, ?)").join(", ");

    const values = roleIds.map((roleId) => [v4(), userId, roleId]).flat();

    dataBase.run(sql, values, (err: Error) => {
      if (err) {
        console.error(err);
      }
    });
  };
}
