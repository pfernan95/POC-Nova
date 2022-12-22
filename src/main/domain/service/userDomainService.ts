import { validate } from "class-validator";
import { Response } from "express";
import { UserRepository } from "../entity/repository/userRepository";
import { RoleRepository } from "../entity/repository/roleRepository";
import { User } from "../entity/user";
import { UserRoleRepository } from "../entity/repository/userRolesRepository";

export class UserDomainService {
  userRepository: UserRepository;
  roleRepository: RoleRepository;
  userRoleRepository: UserRoleRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.roleRepository = new RoleRepository();
    this.userRoleRepository = new UserRoleRepository();
  }

  createUser = async (
    name: string,
    surname: string,
    email: string,
    password: string,
    roles: number[],
    res: Response
  ) => {
    let user = new User();

    user.name = name;
    user.surname = surname;
    user.password_hash = user.hashPw(password);
    user.email = email;
    user.roles = [];

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).json({ errors: errors });
      return;
    }
    try {
      const userExistsByEmail = await this.userRepository.findByEmail(email);

      if (userExistsByEmail) {
        res.status(409).json({ msg: "User already exists with that email" });
        return;
      }
      user = (await this.userRepository.createUser(user)) as unknown as User;

      this.assignRolesToUser(user, roles);

      return res.status(201).json({ msg: "User created successfully" });
    } catch (error) {
      res.status(409).json({ error: error });
      return;
    }
  };

  obtainUserById = async (id: string, res: Response) => {
    try {
      const user = (await this.userRepository.findById(id)) as unknown as User;
      return user;
    } catch (error) {
      res.status(404).send(error);
      return;
    }
  };

  obtainUserByEmail = async (email: string, res: Response) => {
    try {
      const user = (await this.userRepository.findByEmail(
        email
      )) as unknown as User;

      return user;
    } catch (error) {
      res.status(404).send(error);
      return;
    }
  };

  assignRolesToUser = async (user: User, roleIds: number[]) => {
    await this.roleRepository.checkRolesExists(roleIds);

    await this.userRoleRepository.createUserRole(user.id, roleIds);
  };
}
