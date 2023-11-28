import { logger } from "../../utils/logger.util.js";
import {
  getTableIdQuery,
  createTableDataQuery,
  getTableDataQuery,
  hardDeleteTableDataQuery,
} from "../../services/query.service.js";

async function createRestaurantLike(restaurantId, providerId, client) {
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

    const existingRestaurantLike = await getTableIdQuery(
      "restaurant_likes",
      {
        user_id: userIdFromDb,
        restaurant_id: restaurantIdFromDb,
      },
      client,
      true
    );

    if (existingRestaurantLike) {
      logger.warn("User has already liked this restaurant");

      throw new Error("User has already liked this restaurant");
    }

    const body = { user_id: userIdFromDb, restaurant_id: restaurantIdFromDb };

    const createRestaurantLikeData = await createTableDataQuery(
      body,
      "restaurant_likes",
      client
    );

    return createRestaurantLikeData;
  } catch (err) {
    logger.warn("Error in createRestaurantLike: " + err.message);

    return { message: "Error in createRestaurantLike: " + err.message };
  }
}

async function getRestaurantLike(restaurantId, client) {
  try {
    const getRestaurantLikeData = await getTableDataQuery(
      "restaurant_likes",
      {
        restaurant_id: restaurantId,
      },
      client
    );

    return getRestaurantLikeData;
  } catch (err) {
    logger.warn("Error in getRestaurantLike: " + err.message);

    return { message: "Error in getRestaurantLike: " + err.message };
  }
}

async function hardDeleteRestaurantLike(
  restaurantId,
  likeId,
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

    const hardDeleteRestaurantLike = await hardDeleteTableDataQuery(
      "restaurant_likes",
      { id: likeId, restaurant_id: restaurantId, user_id: userIdFromDb },
      client
    );

    return hardDeleteRestaurantLike;
  } catch (err) {
    logger.warn("Error in hardDeleteRestaurantLike: " + err.message);

    return { message: "Error in hardDeleteRestaurantLike: " + err.message };
  }
}

export { createRestaurantLike, getRestaurantLike, hardDeleteRestaurantLike };
