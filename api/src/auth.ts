import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthTokenPayload {
  userId: number;
}

export const getJwtToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
};

export const setJwtToken = token => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", token);
  }
};

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
