import { MaxLength } from "class-validator";

export class Role {
  id: number;

  @MaxLength(5)
  role: string;
}
