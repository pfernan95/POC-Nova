import { NominationDomainService } from "../nominationDomainService";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Nomination } from "../../entity/nomination";
import { UserDomainService } from "../userDomainService";
import { Role } from "../../entity/role";
import { User } from "../../entity/user";
import { NotifierController } from "../../../controllers/out/notifierController";

const nominationRepositoryMock = {
  createNomination: jest.fn(),
  findByEmail: jest.fn(),
  getAcceptedNominations: jest.fn(),
};

const domainServiceMock: Partial<UserDomainService> = {
  obtainUserByEmail: jest.fn(),
};

const notifierControllerMock: Partial<NotifierController> = {
  notifyCandidate: jest.fn(),
  notifyReferral: jest.fn(),
};

jest.mock("../../service/userDomainService", () => {
  return jest.fn().mockImplementation(() => {
    return domainServiceMock;
  });
});

jest.mock("../../entity/repository/nominationRepository", () => {
  return jest.fn().mockImplementation(() => {
    return nominationRepositoryMock;
  });
});

jest.mock("../../../controllers/out/notifierController", () => {
  return jest.fn();
});

describe("nomination domain service", () => {
  let nominationDomainService: NominationDomainService;
  let response: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    nominationDomainService = new NominationDomainService(
      nominationRepositoryMock,
      domainServiceMock as UserDomainService,
      notifierControllerMock as NotifierController
    );
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  test("create a nomination successfully -> returns 201", async () => {
    const user = createDummyUser() as User;

    const nomination: Partial<Nomination> = {
      id: uuidv4(),
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      description: "John doe unit test description",
      overall: 5,
      involvement: 5,
    };

    (domainServiceMock.obtainUserByEmail as jest.Mock).mockResolvedValue(user);
    (
      nominationDomainService.nominationRepository.findByEmail as jest.Mock
    ).mockResolvedValue(undefined);
    (
      nominationDomainService.nominationRepository.createNomination as jest.Mock
    ).mockResolvedValue(nomination);

    await nominationDomainService.createNomination(
      nomination.name!,
      nomination.surname!,
      nomination.email!,
      nomination.description!,
      nomination.involvement!,
      nomination.overall!,
      user.email,
      response
    );

    expect(response.status).toHaveBeenCalledWith(201);
  });

  test("create a nomination but user does not exists -> returns 404", async () => {
    const user = createDummyUser() as User;

    const nomination: Partial<Nomination> = {
      id: uuidv4(),
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      description: "John doe unit test description",
      overall: 5,
      involvement: 5,
    };

    (domainServiceMock.obtainUserByEmail as jest.Mock).mockResolvedValue(
      undefined
    );

    await nominationDomainService.createNomination(
      nomination.name!,
      nomination.surname!,
      nomination.email!,
      nomination.description!,
      nomination.involvement!,
      nomination.overall!,
      user.email,
      response
    );

    expect(response.status).toHaveBeenCalledWith(404);
  });

  test("create a nomination but already exists by email -> returns 409", async () => {
    const user = createDummyUser() as User;

    const nomination: Partial<Nomination> = {
      id: uuidv4(),
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      description: "John doe unit test description",
      overall: 5,
      involvement: 5,
    };

    (domainServiceMock.obtainUserByEmail as jest.Mock).mockResolvedValue(user);
    (
      nominationDomainService.nominationRepository.findByEmail as jest.Mock
    ).mockResolvedValue(nomination);

    await nominationDomainService.createNomination(
      nomination.name!,
      nomination.surname!,
      nomination.email!,
      nomination.description!,
      nomination.involvement!,
      nomination.overall!,
      user.email,
      response
    );

    expect(response.status).toHaveBeenCalledWith(409);
  });
});

const createDummyUser = () => {
  const roleId = 1;
  const role: Role = {
    id: roleId,
    role: "ADMIN",
  };

  const roles: Role[] = [];

  roles.push(role as Role);

  const user: Partial<User> = {
    id: uuidv4(),
    name: "George",
    surname: "Best",
    email: "george.best@example.com",
    password_hash: "hashpw",
    roles: roles,
  };

  return user;
};
