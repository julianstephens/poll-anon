import * as jwt from "jsonwebtoken";
import { Context } from "../context";

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthTokenPayload {
  userId: number;
}

export const getToken = (context: Context) => {
  const bearer = context.req.headers.authorization || '';
  return bearer.replace("Bearer ", "");
}

export const getUserId = token => {
  try {
    const decoded = jwt.verify(token, `${JWT_SECRET}`);
    if (!decoded) throw new Error("Unauthorized");

    const userId = (decoded as AuthTokenPayload).userId;
    return userId;
  } catch (e) {
    return undefined;
  }
};
