import { AuthDomainService } from "../authDomainService";
import { Response } from "express";
import { UserRepository } from "../../entity/repository/userRepository";
import { Role } from "../../entity/role";
import { User } from "../../entity/user";
import { v4 as uuidv4 } from "uuid";
import { when } from "jest-when";
import bcrypt from "bcryptjs";

const userRepositoryMock: Partial<UserRepository> = {
  findByEmail: jest.fn(),
};

jest.mock("bcryptjs", () => ({
  compareSync: jest.fn(),
}));

jest.mock("../../entity/repository/userRepository", () => {
  return jest.fn().mockImplementation(() => {
    return userRepositoryMock;
  });
});

describe("auth domain service", () => {
  let authDomainService: AuthDomainService;
  let response: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    authDomainService = new AuthDomainService(
      userRepositoryMock as UserRepository
    );
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  test("login successfully -> returns 200", async () => {
    const user = createDummyUser();
    const email = "george.best@example.com";
    const password = "password";

    (
      authDomainService.userRepository.findByEmail as jest.Mock
    ).mockResolvedValue(user);

    when(bcrypt.compareSync)
      .calledWith("password", "hashpw")
      .mockReturnValue(true);
    await authDomainService.login(email, password, response);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  test("login but password does not match", async () => {
    const user = createDummyUser();
    const email = "george.best@example.com";
    const password = "password";

    (
      authDomainService.userRepository.findByEmail as jest.Mock
    ).mockResolvedValue(user);
    when(bcrypt.compareSync)
      .calledWith("password", "hashpw")
      .mockReturnValue(false);

    await authDomainService.login(email, password, response);

    expect(response.json).toHaveBeenCalledWith({
      msg: "Invalid password. Try again.",
    });
  });

  test("login but user does not exists", async () => {
    const email = "george.best@example.com";
    const password = "password";

    (
      authDomainService.userRepository.findByEmail as jest.Mock
    ).mockResolvedValue(undefined);

    await authDomainService.login(email, password, response);

    expect(response.status).toHaveBeenCalledWith(404);
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
  } as unknown as User;

  return user;
};
