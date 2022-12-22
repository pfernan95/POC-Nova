import { Request, Response } from "express";
import { NominationDomainService } from "../../domain/service/nominationDomainService";

export class NominationAppService {
  nominationDomainService: NominationDomainService;
  
  constructor(nominationDomainService: NominationDomainService) {
    this.nominationDomainService = nominationDomainService;
  }

  createNomination = async (req: Request, res: Response) => {
    const {
      name,
      surname,
      email,
      description,
      involvement,
      overall,
      userEmail,
    } = req.body;

    if (
      !(
        name &&
        surname &&
        email &&
        description &&
        involvement &&
        overall &&
        userEmail
      )
    ) {
      res.status(400).send();
      return;
    }
    await this.nominationDomainService.createNomination(
      name,
      surname,
      email,
      description,
      involvement,
      overall,
      userEmail,
      res
    );
  };

  getNominations = async (res: Response) => {
    await this.nominationDomainService.getNominations(res);
  };
}
