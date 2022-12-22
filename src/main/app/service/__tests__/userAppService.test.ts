import { Request, Response } from "express";
import { UserDomainService } from "../../../domain/service/userDomainService";
import { UserAppService } from "../userAppService";

const userDomainServiceMock: Partial<UserDomainService> = {
  createUser: jest.fn(),
};

jest.mock("../../../domain/service/userDomainService", () => {
  return jest.fn().mockImplementation(() => {
    return userDomainServiceMock;
  });
});

describe("user app service", () => {
  let userAppService: UserAppService;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    userAppService = new UserAppService(
      userDomainServiceMock as UserDomainService
    );
    request = {
      body: {
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        password: "password",
        roles: [0, 1],
      },
    } as unknown as Request;
    response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
  });

  test("create an user successfully -> returns 201", async () => {
    (
      userAppService.userDomainService.createUser as jest.Mock
    ).mockResolvedValue(response);
    await userAppService.createUser(request, response);

    expect(userDomainServiceMock.createUser).toHaveBeenCalledWith(
      "John",
      "Doe",
      "john.doe@example.com",
      "password",
      [0, 1],
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
    await userAppService.createUser(request, response);

    expect(userDomainServiceMock.createUser).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalled();
  });
});
