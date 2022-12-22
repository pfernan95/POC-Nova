import { Request, Response } from "express";
import { UserDomainService } from "../../domain/service/userDomainService";

export class UserAppService {
  userDomainService: UserDomainService;

  constructor(userDomainService: UserDomainService) {
    this.userDomainService = userDomainService;
  }
  createUser = async (req: Request, res: Response) => {
    const { name, surname, email, password, roles } = req.body;

    if (!(email && password && name && surname && roles)) {
      res.status(400).send();
      return;
    }
    await this.userDomainService.createUser(
      name,
      surname,
      email,
      password,
      roles,
      res
    );
  };
}
