import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import moment from "moment";

export const checkJwtToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.substring(
    7,
    req.headers["authorization"].length
  ) as string;
  let payload;

  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "aux-secret_$dla2q2"
    ) as any;
    res.locals.jwtPayload = payload;

    if (payload.expiredAt < moment().unix()) {
      return res.status(401).json({ error: "Token has expired." });
    }
  } catch (error) {
    res.status(401).send();
    return;
  }
  next();
};
