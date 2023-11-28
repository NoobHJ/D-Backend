import { Router } from "express";

import authenticateUser from "../../middlewares/auth.middleware.js";
import withDatabase from "../../middlewares/database.middleware.js";
import {
  createRestaurantReview,
  getRestaurantReview,
  editRestaurantReview,
  softDeleteRestaurantReview,
} from "../../controllers/restaurant/review.controller.js";

const router = Router();

router.post(
  "/:restaurantId/review/create",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    const { restaurantId } = req.params;
    const { body } = req;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await createRestaurantReview(
      restaurantId,
      body,
      providerId,
      client
    );

    return res.json(result);
  }
);

router.get("/:restaurantId/review", withDatabase, async (req, res) => {
  const { restaurantId } = req.params;
  const { client } = req.dbClient;
  const result = await getRestaurantReview(restaurantId, client);

  return res.json(result);
});

router.patch(
  "/:restaurantId/review/:reviewId/edit",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    const { restaurantId, reviewId } = req.params;
    const { body } = req;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await editRestaurantReview(
      restaurantId,
      reviewId,
      body,
      providerId,
      client
    );

    return res.json(result);
  }
);

router.patch(
  "/:restaurantId/review/:reviewId/delete",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    const { restaurantId, reviewId } = req.params;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await softDeleteRestaurantReview(
      restaurantId,
      reviewId,
      providerId,
      client
    );

    return res.json(result);
  }
);

export default router;
