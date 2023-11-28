import { logger } from "../../utils/logger.util.js";
import {
  getTableIdQuery,
  getTableDataQuery,
  updateTableDataQuery,
  softDeleteTableDataQuery,
  createTableDataQuery,
} from "../../services/query.service.js";
import { verifyFields, isValidEmail } from "../../services/verify.service.js";

async function getUser(userId, providerId, client) {
  try {
    const userIdFromDb = await getTableIdQuery(
      "users",
      {
        provider_id: providerId,
      },
      client
    );

    if (!userIdFromDb) {
      logger.warn("User not found with provided provider_id: " + userIdFromDb);

      throw new Error("User not found with provided provider_id");
    }

    if (parseInt(userId) !== userIdFromDb) {
      logger.warn("User id does not match with id: " + userIdFromDb);

      throw new Error("User id does not match with id");
    }

    const getUserData = await getTableDataQuery(
      "users",
      {
        id: userIdFromDb,
      },
      client
    );

    return { message: "Success", user: getUserData[0] };
  } catch (err) {
    logger.warn("Error in getUser: " + err.message);

    throw err;
  } finally {
    client.release();
  }
}

async function createUser(user, provider, client) {
  try {
    if (!user || Object.keys(user).length === 0) {
      throw new Error("User data is not provided");
    }

    const missingFields = await verifyFields(user, ["id", "email", "name"]);

    if (missingFields.length > 0) {
      throw new Error(
        "Missing necessary user data: " + missingFields.join(", ")
      );
    }

    const { id, email, name, photo } = user;

    if (!(await isValidEmail(email))) {
      throw new Error("Provided email address is invalid");
    }

    const userIdFromDb = await getTableIdQuery(
      "users",
      {
        provider_id: id,
        email,
      },
      client,
      true
    );

    if (!userIdFromDb) {
      logger.info("User not found with provided provider_id: " + userIdFromDb);

      const body = {
        email,
        username: name,
        nickname: name,
        profile_image: photo,
        provider,
        provider_id: id,
      };

      await createTableDataQuery(body, "users", client);

      return user;
    }

    return user;
  } catch (err) {
    logger.warn("Error in createUser:", err.message);

    throw err;
  } finally {
    client.release();
  }
}

async function updateUser(userId, body, providerId, client) {
  try {
    const userIdFromDb = await getTableIdQuery(
      "users",
      {
        provider_id: providerId,
      },
      client
    );

    if (!userIdFromDb) {
      logger.warn("User not found with provided provider_id: " + userIdFromDb);

      throw new Error("User not found with provided provider_id");
    }

    if (parseInt(userId) !== userIdFromDb) {
      logger.warn("User id does not match with id: " + userIdFromDb);

      throw new Error("User id does not match with id");
    }

    await updateTableDataQuery(
      body,
      "users",
      {
        id: userIdFromDb,
      },
      client
    );

    return { message: "Success" };
  } catch (err) {
    logger.warn("Error in updateUser: ", err.message);

    throw err;
  } finally {
    client.release();
  }
}

async function softDeleteUser(userId, providerId, client) {
  try {
    const userIdFromDb = await getTableIdQuery(
      "users",
      {
        provider_id: providerId,
      },
      client
    );

    if (!userIdFromDb) {
      logger.warn("User not found with provided provider_id: " + userIdFromDb);

      throw new Error("User not found with provided provider_id");
    }

    if (parseInt(userId) !== userIdFromDb) {
      logger.warn("User id does not match with id: " + userIdFromDb);

      throw new Error("User id does not match with id");
    }

    await softDeleteTableDataQuery(
      "users",
      {
        id: userId,
      },
      client
    );

    return { message: "Success" };
  } catch (err) {
    logger.warn("Error in softDeleteUser: ", err.message);

    throw err;
  } finally {
    client.release();
  }
}

export { getUser, createUser, updateUser, softDeleteUser };
