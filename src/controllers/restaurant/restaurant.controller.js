import { logger } from "../../utils/logger.util.js";
import {
  getTableIdQuery,
  createTableDataQuery,
  getTableDataQuery,
  updateTableDataQuery,
  softDeleteTableDataQuery,
} from "../../services/query.service.js";
import { verifyFields } from "../../services/verify.service.js";

async function createRestaurant(body, providerId, client) {
  try {
    if (!body || Object.keys(body).length === 0) {
      throw new Error("Body data is not provided");
    }

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

    body["user_id"] = userIdFromDb;

    const missingFields = await verifyFields(body, [
      "name",
      "address",
      "latitude",
      "longitude",
      "user_id",
    ]);

    if (missingFields.length > 0) {
      throw new Error(
        "Missing necessary restaurant data: " + missingFields.join(", ")
      );
    }

    await createTableDataQuery(body, "restaurants", client);

    return { message: "Success" };
  } catch (err) {
    logger.warn("Error in createRestaurant: " + err.message);

    throw err;
  } finally {
    client.release();
  }
}

async function getAllRestaurant(client) {
  try {
    const getAllRestaurantData = await getTableDataQuery(
      "restaurants",
      {},
      client
    );

    return { message: "Success", restaurants: getAllRestaurantData };
  } catch (err) {
    logger.warn("Error in getAllRestaurant: " + err.message);

    throw err;
  }
}

async function getRestaurant(restaurantId, client) {
  try {
    const getRestaurantData = await getTableDataQuery(
      "restaurants",
      {
        id: restaurantId,
      },
      client
    );

    return { message: "Success", restaurant: getRestaurantData[0] };
  } catch (err) {
    logger.warn("Error in getRestaurant: " + err.message);

    throw err;
  } finally {
    client.release();
  }
}

async function updateRestaurant(restaurantId, body, providerId, client) {
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

    await updateTableDataQuery(
      body,
      "restaurants",
      {
        id: restaurantId,
        user_id: userIdFromDb,
      },
      client
    );

    return { message: "Success" };
  } catch (err) {
    logger.warn("Error in updateRestaurant: " + err.message);

    throw err;
  } finally {
    client.release();
  }
}

async function softDeleteRestaurant(restaurantId, providerId, client) {
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

    await softDeleteTableDataQuery(
      "restaurants",
      {
        id: restaurantId,
        user_id: userIdFromDb,
      },
      client
    );

    return { message: "Success" };
  } catch (err) {
    logger.warn("Error in softDeleteRestaurant: " + err.message);

    throw err;
  } finally {
    client.release();
  }
}

export {
  createRestaurant,
  getRestaurant,
  getAllRestaurant,
  updateRestaurant,
  softDeleteRestaurant,
};
