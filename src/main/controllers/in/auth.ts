import { Request, Response } from "express";
import { AuthAppService } from "../../app/service/authAppService";
import { UserRepository } from "../../domain/entity/repository/userRepository";
import { AuthDomainService } from "../../domain/service/authDomainService";

export class Auth {
  private authAppService = new AuthAppService(
    new AuthDomainService(new UserRepository())
  );

  login = async (req: Request, res: Response) => {
    await this.authAppService.login(req, res);
  };
}
