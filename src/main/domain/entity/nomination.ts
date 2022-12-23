import { Min, Max, IsEmail, IsInt, Length, IsNumber } from "class-validator";

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

  @IsNumber()
  @Min(0)
  @Max(10)
  involvement: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  overall: number;

  status: string;

  user_id: string;
}
