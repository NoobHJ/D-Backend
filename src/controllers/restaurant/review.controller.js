import { logger } from "../../utils/logger.util.js";
import {
  createTableDataQuery,
  getTableIdQuery,
  getTableDataQuery,
  updateTableDataQuery,
  softDeleteTableDataQuery,
} from "../../services/query.service.js";

async function createRestaurantReview(restaurantId, body, providerId, client) {
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

    body["user_id"] = userIdFromDb;
    body["restaurant_id"] = restaurantIdFromDb;

    const createRestaurantReviewData = await createTableDataQuery(
      body,
      "restaurant_reviews",
      client
    );

    return createRestaurantReviewData;
  } catch (err) {
    logger.warn("Error in createRestaurantReview: " + err.message);

    return { message: "Error in createRestaurantReview: " + err.message };
  }
}

async function getRestaurantReview(restaurantId, client) {
  try {
    const getRestaurantReviewData = await getTableDataQuery(
      "restaurant_reviews",
      { restaurant_id: restaurantId },
      client
    );

    return getRestaurantReviewData;
  } catch (err) {
    logger.warn("Error in getRestaurantReview: " + err.message);

    return { message: "Error in getRestaurantReview: " + err.message };
  }
}

async function editRestaurantReview(
  restaurantId,
  reviewId,
  body,
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

    const restaurantReviewIdFromDb = await getTableIdQuery(
      "restaurant_reviews",
      {
        id: reviewId,
        restaurant_id: restaurantId,
      },
      client
    );

    if (!restaurantReviewIdFromDb) {
      logger.warn(
        "RestaurantReview not found with provided restaurant_review_id: " +
          restaurantReviewIdFromDb
      );

      throw new Error(
        "RestaurantReview not found with provided restaurant_review_id: " +
          restaurantReviewIdFromDb
      );
    }

    const updateRestaurantReviewData = await updateTableDataQuery(
      body,
      "restaurant_reviews",
      {
        id: reviewId,
        restaurant_id: restaurantId,
      },
      client
    );

    return updateRestaurantReviewData;
  } catch (err) {
    logger.warn("Error in editRestaurantReview: " + err.message);

    return { message: "Error in editRestaurantReview: " + err.message };
  }
}

async function softDeleteRestaurantReview(
  restaurantId,
  reviewId,
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

    const softDeleteRestaurantReviewData = softDeleteTableDataQuery(
      "restaurant_reviews",
      {
        id: reviewId,
        user_id: userIdFromDb,
        restaurant_id: restaurantId,
      },
      client
    );

    return softDeleteRestaurantReviewData;
  } catch (err) {
    logger.warn("Error in softDeleteRestaurantReview: " + err.message);

    return { message: "Error in softDeleteRestaurantReview: " + err.message };
  }
}

export {
  createRestaurantReview,
  getRestaurantReview,
  editRestaurantReview,
  softDeleteRestaurantReview,
};
