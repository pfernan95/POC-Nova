import { Request, Response } from "express";
import { NominationAppService } from "../../app/service/nominationAppService";
import { NominationRepository } from "../../domain/entity/repository/nominationRepository";
import { UserRepository } from "../../domain/entity/repository/userRepository";
import { NominationDomainService } from "../../domain/service/nominationDomainService";
import { UserDomainService } from "../../domain/service/userDomainService";
import { NotifierController } from "../out/notifierController";

export class NominationController {
  private nominationAppService = new NominationAppService(new NominationDomainService(
    new NominationRepository(),
    new UserDomainService(new UserRepository()),
    new NotifierController()
  ));

  createNomination = async (req: Request, res: Response) => {
    await this.nominationAppService.createNomination(req, res);
  };

  getNominations = async (req: Request, res: Response) => {
    await this.nominationAppService.getNominations(res);
  };
}
