import { Request, Response } from "express";
import { NominationDomainService } from "../../../domain/service/nominationDomainService";
import { NominationAppService } from "../nominationAppService";

const nominationDomainServiceMock: Partial<NominationDomainService> = {
  createNomination: jest.fn(),
  getNominations: jest.fn(),
};

jest.mock("../../../domain/service/nominationDomainService", () => {
  return jest.fn().mockImplementation(() => {
    return nominationDomainServiceMock;
  });
});

describe("user app service", () => {
  let nominationAppService: NominationAppService;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    nominationAppService = new NominationAppService(
      nominationDomainServiceMock as NominationDomainService
    );

    request = {
      body: {
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        description: "test description",
        involvement: 6,
        overall: 6,
        userEmail: "george.best@example.com",
      },
    } as unknown as Request;
    response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
  });

  test("create a nomination successfully -> returns 201", async () => {
    (
      nominationAppService.nominationDomainService.createNomination as jest.Mock
    ).mockResolvedValue(response);
    await nominationAppService.createNomination(request, response);

    expect(nominationDomainServiceMock.createNomination).toHaveBeenCalledWith(
      "John",
      "Doe",
      "john.doe@example.com",
      "test description",
      6,
      6,
      "george.best@example.com",
      response
    );
    expect(response.status).not.toHaveBeenCalled();
    expect(response.send).not.toHaveBeenCalled();
  });

  test("create an user but some fields are missing -> returns 400", async () => {
    request.body = {
      name: "",
      email: "",
    };
    await nominationAppService.createNomination(request, response);

    expect(nominationDomainServiceMock.createNomination).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalled();
  });

  test("list nominations -> returns 200", async () => {
    await nominationAppService.getNominations(response);

    expect(nominationDomainServiceMock.getNominations).toHaveBeenCalledWith(
      response
    );
  });
});
