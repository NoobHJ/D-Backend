import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { logger } from "../utils/logger.util.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

async function authenticateUser(req, res, next) {
  try {
    let token = req.headers.authorization;

    if (!token) {
      throw new Error("No token provided");
    }

    const BEARER_PREFIX = "Bearer ";

    if (!token.startsWith(BEARER_PREFIX)) {
      throw new Error("Invalid token format");
    }

    token = token.slice(BEARER_PREFIX.length);

    const user = jwt.verify(token, JWT_SECRET);

    if (!user) {
      throw new Error("Invalid or expired token");
    }

    await isTokenExpired(user);
    await isTokenFromFuture(user);

    const providerId = user.id;

    req.user = { providerId };

    next();
  } catch (err) {
    logger.warn("Error in authenticateUser: " + err);

    return res.status(401).json({ message: err.message });
  }
}

async function isTokenExpired(data) {
  try {
    if (Math.floor(Date.now() / 1000) > data.exp) {
      throw new Error("This token has expired!");
    }
  } catch (err) {
    logger.warn("Error in isTokenExpired: ", err);

    throw err;
  }
}

async function isTokenFromFuture(data) {
  try {
    if (Math.floor(Date.now() / 1000) < data.iat) {
      throw new Error("This token was issued in the future!");
    }
  } catch (err) {
    logger.warn("Error in isTokenFromFuture: ", err);

    throw err;
  }
}

export default authenticateUser;
