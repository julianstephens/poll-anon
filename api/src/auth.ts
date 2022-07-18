import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthTokenPayload {
  userId: number;
}

export const getUserId = token => {
  try {
    const decoded = jwt.verify(token, `${JWT_SECRET}`);
    if (!decoded) throw new Error("Unauthorized");

    const userId = (decoded as AuthTokenPayload).userId;
    return userId;
  } catch (e) {
    return null;
  }
};
