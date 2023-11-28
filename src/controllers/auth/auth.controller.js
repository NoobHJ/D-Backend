import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { logger } from "../../utils/logger.util.js";
import { createUser } from "../user/user.controller.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

async function createJwt(user) {
  try {
    const { id, email, name } = user;
    const token = jwt.sign({ id, email, name }, JWT_SECRET, {
      expiresIn: "24h",
    });

    logger.info("Jwt successfully created");

    return token;
  } catch (err) {
    logger.warn(`Error createJwt: ` + err.message);

    throw err;
  }
}

async function handleAuthentication(user, provider, client) {
  try {
    const newOrExistUser = await createUser(user, provider, client);
    const token = await createJwt(newOrExistUser);

    return { message: "Success", token: token };
  } catch (err) {
    logger.warn(`Error in handleAuthentication: ` + err);

    throw err;
  }
}

export { createJwt, handleAuthentication };
