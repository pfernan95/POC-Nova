import { UserDomainService } from "../userDomainService";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../entity/user";
import { Role } from "../../entity/role";

const repositoryMock = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  createUser: jest.fn(),
};

jest.mock("../../entity/repository/userRepository", () => {
  return jest.fn().mockImplementation(() => {
    return repositoryMock;
  });
});

describe("user domain service", () => {
  let userDomainService: UserDomainService;
  let response: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    userDomainService = new UserDomainService(repositoryMock);
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  test("create an user successfully -> returns 201", async () => {
    const roleId = 1;
    const role: Role = {
      id: roleId,
      role: "ADMIN",
    };

    const roles: Role[] = [];

    roles.push(role as Role);

    const user: Partial<User> = {
      id: uuidv4(),
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      password_hash: "hashpw",
      roles: roles,
    };

    (
      userDomainService.userRepository.findByEmail as jest.Mock
    ).mockResolvedValue(undefined);
    (
      userDomainService.userRepository.createUser as jest.Mock
    ).mockResolvedValue(user);

    await userDomainService.createUser(
      user.name!,
      user.surname!,
      user.email!,
      user.password_hash!,
      [roleId],
      response
    );

    expect(response.status).toHaveBeenCalledWith(201);
  });

  test("create an user but already exists with email -> returns 409", async () => {
    const roleId = 1;
    const role: Role = {
      id: roleId,
      role: "ADMIN",
    };

    const roles: Role[] = [];

    roles.push(role as Role);

    const user: Partial<User> = {
      id: uuidv4(),
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      password_hash: "hashpw",
      roles: roles,
    };

    (
      userDomainService.userRepository.findByEmail as jest.Mock
    ).mockResolvedValue(user);

    await userDomainService.createUser(
      user.name!,
      user.surname!,
      user.email!,
      user.password_hash!,
      [roleId],
      response
    );

    expect(response.status).toHaveBeenCalledWith(409);
  });

  test("create an user with invalid fields -> returns 400", async () => {
    const roleId = 1;
    const role: Role = {
      id: roleId,
      role: "ADMIN",
    };

    const roles: Role[] = [];

    roles.push(role as Role);

    const user: Partial<User> = {
      id: uuidv4(),
      name: "John",
      surname: "Doe",
      email: "",
      password_hash: "hashpw",
      roles: roles,
    };

    await userDomainService.createUser(
      user.name!,
      user.surname!,
      user.email!,
      user.password_hash!,
      [roleId],
      response
    );

    expect(response.status).toHaveBeenCalledWith(400);
  });

  test("obtain an user by id -> returns 201", async () => {
    const roleId = 1;
    const role: Role = {
      id: roleId,
      role: "ADMIN",
    };

    const roles: Role[] = [];

    roles.push(role as Role);

    const user: Partial<User> = {
      id: uuidv4(),
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      password_hash: "hashpw",
      roles: roles,
    };

    (userDomainService.userRepository.findById as jest.Mock).mockResolvedValue(
      user
    );

    const expectedUser = await userDomainService.obtainUserById(
      user.id!,
      response
    );

    expect(expectedUser?.email).toEqual(user.email);
  });
});
