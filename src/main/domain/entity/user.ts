import * as bcrypt from "bcryptjs";
import { IsEmail, Length } from "class-validator";
import { Role } from "./role";

export class User {
  id: string;

  @Length(3, 50)
  name: string;

  @Length(3, 50)
  surname: string;

  @Length(8, 50)
  @IsEmail()
  email: string;

  @Length(60, 60)
  password_hash: string;

  roles: Role[];

  hashPw(password: string) {
    return (this.password_hash = bcrypt.hashSync(password));
  }
}
