import { Request, Response } from "express";
import { UserAppService } from "../../app/service/userAppService";
import { UserRepository } from "../../domain/entity/repository/userRepository";
import { UserDomainService } from "../../domain/service/userDomainService";

export class UserController {
  private userAppService = new UserAppService(
    new UserDomainService(new UserRepository())
  );

  createUser = async (req: Request, res: Response) => {
    await this.userAppService.createUser(req, res);
  };
}
