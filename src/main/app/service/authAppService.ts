import { Request, Response } from "express";
import { AuthDomainService } from "../../domain/service/authDomainService";

export class AuthAppService {
  authDomainService: AuthDomainService;

  constructor(authDomainService: AuthDomainService) {
    this.authDomainService = authDomainService
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({msg: "Email or password are not provided."});
      return;
    }
    console.log(req.body);
    await this.authDomainService.login(email, password, res);
  };
}
