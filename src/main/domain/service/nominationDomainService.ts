import { validate } from "class-validator";
import { Response } from "express";
import { Nomination } from "../entity/nomination";
import { NotifierController } from "../../controllers/out/notifierController";
import { UserDomainService } from "./userDomainService";
import { v4 as uuidv4 } from "uuid";
import { NominationRepository } from "../entity/repository/nominationRepository";

export class NominationDomainService {
  userDomainService: UserDomainService;
  nominationRepository: NominationRepository;

  notifierController: NotifierController;

  constructor(
    nominationRepository: NominationRepository,
    userDomainService: UserDomainService,
    notifierController: NotifierController
  ) {
    this.nominationRepository = nominationRepository;
    this.userDomainService = userDomainService;
    this.notifierController = notifierController;
  }

  createNomination = async (
    name: string,
    surname: string,
    email: string,
    description: string,
    involvement: number,
    overall: number,
    userEmail: string,
    res: Response
  ) => {
    const user = await this.userDomainService.obtainUserByEmail(userEmail, res);

    let nomination = new Nomination();

    if (user) {
      nomination.id = uuidv4();
      nomination.name = name;
      nomination.surname = surname;
      nomination.email = email;
      nomination.description = description;
      nomination.involvement = involvement;
      nomination.overall = overall;
      nomination.user_id = user.id;

      const errors = await validate(nomination);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
      try {
        if (await this.checkNominationAlreadyExists(email)) {
          res.status(409).json({ msg: "Nomination already registered." });
          return;
        }

        if (overall < 8) {
          nomination.status = "REJECTED";
        } else {
          nomination.status = "ACCEPTED";
        }

        nomination = (await this.nominationRepository.createNomination(
          nomination
        )) as unknown as Nomination;

        if (overall < 8) {
          this.notifierController.notifyCandidate(
            nomination,
            `Hello ${nomination.name} ${nomination.surname}! Thank you for applying for this position. Unfortunately, the optimum level has not been reached to fit the profile.`
          );

          this.notifierController.notifyReferral(
            nomination,
            user.email,
            `Hello ${user.name} ${user.surname}! Unfortunately, your referral ${nomination.name} ${nomination.surname} has not been reached the optimum level to fit the profile.`
          );
        }
        res.status(201).json({ msg: "Nomination registered successfully." });
      } catch (error) {
        res.status(409).send(error);
        return;
      }
    } else {
      res.status(404).json({ msg: "No registered users with that email" });
    }
  };

  getNominations = async (res: Response) => {
    try {
      const nominations =
        await this.nominationRepository.getAcceptedNominations();
      res.json({ nominations });
    } catch (error) {
      res.status(404).send(error);
      return;
    }
  };

  checkNominationAlreadyExists = async (email: string) => {
    try {
      return await this.nominationRepository.findByEmail(email);
    } catch (error) {
      return error;
    }
  };
}
