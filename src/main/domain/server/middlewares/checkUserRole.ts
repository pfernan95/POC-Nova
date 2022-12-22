import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../entity/repository/userRepository";
import { User } from "../../entity/user";
import { UserDomainService } from "../../service/userDomainService";

const userDomainService = new UserDomainService(new UserRepository());

export const checkRole = (roleId: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = res.locals.jwtPayload.userId;
    const user = (await userDomainService.obtainUserById(id, res)) as User;

    const userRoleIds = user.roles as unknown as number[];

    if (userRoleIds.includes(roleId)) {
      next();
    } else {
      next(
        res
          .status(401)
          .json({ msg: "Only ADMIN users can access this resource." })
      );
    }
  };
};
