import { logger } from "../../utils/logger.util.js";
import {
  getTableIdQuery,
  createTableDataQuery,
  getTableDataQuery,
  hardDeleteTableDataQuery,
} from "../../services/query.service.js";

async function createRestaurantDibs(restaurantId, providerId, client) {
  try {
    const userIdFromDb = await getTableIdQuery(
      "users",
      {
        provider_id: providerId,
      },
      client
    );

    if (!userIdFromDb) {
      logger.warn(`User not found with provided provider_id: ${providerId}`);
      throw new Error("User not found with provided provider_id");
    }

    const restaurantIdFromDb = await getTableIdQuery(
      "restaurants",
      {
        id: restaurantId,
      },
      client
    );

    if (!restaurantIdFromDb) {
      logger.warn(
        "Restaurant not found with provided restaurant_id: " +
          restaurantIdFromDb
      );

      throw new Error(
        "Restaurant not found with provided restaurant_id: " +
          restaurantIdFromDb
      );
    }

    const existingRestaurantDibs = await getTableIdQuery(
      "restaurant_dibs",
      {
        user_id: userIdFromDb,
        restaurant_id: restaurantIdFromDb,
      },
      client,
      true
    );

    if (existingRestaurantDibs) {
      logger.warn("User has already dibs this restaurant");

      throw new Error("User has already dibs this restaurant");
    }

    const body = { user_id: userIdFromDb, restaurant_id: restaurantIdFromDb };

    const createRestaurantDibsData = await createTableDataQuery(
      body,
      "restaurant_dibs",
      client
    );

    return createRestaurantDibsData;
  } catch (err) {
    logger.warn("Error in createRestaurantDibs: " + err.message);

    return { message: "Error in createRestaurantDibs: " + err.message };
  }
}

async function getRestaurantDibs(restaurantId, client) {
  try {
    const getRestaurantDibsData = await getTableDataQuery(
      "restaurant_dibs",
      {
        restaurant_id: restaurantId,
      },
      client
    );

    return getRestaurantDibsData;
  } catch (err) {
    logger.warn("Error in getRestaurantDibs: " + err.message);

    return { message: "Error in getRestaurantDibs: " + err.message };
  }
}

async function hardDeleteRestaurantDibs(
  restaurantId,
  dibsId,
  providerId,
  client
) {
  try {
    const userIdFromDb = await getTableIdQuery(
      "users",
      {
        provider_id: providerId,
      },
      client
    );

    if (!userIdFromDb) {
      logger.warn(`User not found with provided provider_id: ${providerId}`);
      throw new Error("User not found with provided provider_id");
    }

    const restaurantIdFromDb = await getTableIdQuery(
      "restaurants",
      {
        id: restaurantId,
      },
      client
    );

    if (!restaurantIdFromDb) {
      logger.warn(
        "Restaurant not found with provided restaurant_id: " +
          restaurantIdFromDb
      );

      throw new Error(
        "Restaurant not found with provided restaurant_id: " +
          restaurantIdFromDb
      );
    }

    const hardDeleteRestaurantDibs = await hardDeleteTableDataQuery(
      "restaurant_dibs",
      { id: dibsId, restaurant_id: restaurantId, user_id: userIdFromDb },
      client
    );

    return hardDeleteRestaurantDibs;
  } catch (err) {
    logger.warn("Error in hardDeleteRestaurantDibs: " + err.message);

    return { message: "Error in hardDeleteRestaurantDibs: " + err.message };
  }
}

export { createRestaurantDibs, getRestaurantDibs, hardDeleteRestaurantDibs };
