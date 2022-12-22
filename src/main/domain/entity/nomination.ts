import { Min, Max, IsEmail, IsInt, Length } from "class-validator";
import { User } from "./user";

export class Nomination {
  id: string;

  name: string;

  @Length(3, 50)
  surname: string;

  @Length(8, 50)
  @IsEmail()
  email: string;

  @Length(20, 300)
  description: string;

  @IsInt()
  @Min(0)
  @Max(10)
  involvement: number;

  @IsInt()
  @Min(0)
  @Max(10)
  overall: number;

  status: string;

  user: User;

  user_id: string;
}
