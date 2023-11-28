import { logger } from "../utils/logger.util.js";

async function verifyFields(object, fields) {
  try {
    const missingFields = [];

    fields.forEach((field) => {
      if (!object[field]) {
        missingFields.push(field);
      }
    });

    return missingFields;
  } catch (err) {
    logger.warn("Error in verifyFields:", err);

    throw err;
  }
}

async function isValidEmail(email) {
  try {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return emailRegex.test(email);
  } catch (err) {
    logger.warn("Error in isVaildEmail:", err);

    throw err;
  }
}

export { verifyFields, isValidEmail };
