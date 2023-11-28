import { Router } from "express";

import authenticateUser from "../../middlewares/auth.middleware.js";
import withDatabase from "../../middlewares/database.middleware.js";
import {
  createRestaurantLike,
  getRestaurantLike,
  hardDeleteRestaurantLike,
} from "../../controllers/restaurant/like.controller.js";

const router = Router();

router.post(
  "/:restaurantId/like/create",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    const { restaurantId } = req.params;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await createRestaurantLike(restaurantId, providerId, client);

    return res.json(result);
  }
);

router.get("/:restaurantId/like", withDatabase, async (req, res) => {
  const { restaurantId } = req.params;
  const { client } = req.dbClient;
  const result = await getRestaurantLike(restaurantId, client);

  return res.json(result);
});

router.delete(
  "/:restaurantId/like/:likeId/delete",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    const { restaurantId, likeId } = req.params;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await hardDeleteRestaurantLike(
      restaurantId,
      likeId,
      providerId,
      client
    );

    return res.json(result);
  }
);

export default router;
