import { Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/user";
import * as bcrypt from "bcryptjs";
import moment from "moment";
import { UserRepository } from "../entity/repository/userRepository";

export class AuthDomainService {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  login = async (email: string, password: string, res: Response) => {
    let user: User | undefined;
    try {
      user = (await this.userRepository.findByEmail(email)) as unknown as User;
    } catch (error) {
      res.status(500).send();
    }

    if (user) {
      const passwordMatch = bcrypt.compareSync(password, user.password_hash!);

      if (passwordMatch) {
        res.status(200).json({
          token: createToken(user),
        });
      } else {
        res.status(200).json({ msg: "Invalid password. Try again." });
      }
    } else {
      res.status(404).json({ msg: "User not found with that email" });
    }
  };
}

const createToken = (user: Partial<User>) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      expiredAt: moment().add(1, "hours").unix(),
    },
    process.env.JWT_SECRET || "aux-secret_$dla2q2",
    { expiresIn: "1h" }
  );
};
