import { Router } from "express";

import authenticateUser from "../../middlewares/auth.middleware.js";
import withDatabase from "../../middlewares/database.middleware.js";
import {
  createRestaurantDibs,
  getRestaurantDibs,
  hardDeleteRestaurantDibs,
} from "../../controllers/restaurant/dibs.controller.js";

const router = Router();

router.post(
  "/:restaurantId/dibs/create",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    const { restaurantId } = req.params;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await createRestaurantDibs(restaurantId, providerId, client);

    return res.json(result);
  }
);

router.get("/:restaurantId/dibs", withDatabase, async (req, res) => {
  const { restaurantId } = req.params;
  const { client } = req.dbClient;
  const result = await getRestaurantDibs(restaurantId, client);

  return res.json(result);
});

router.delete(
  "/:restaurantId/dibs/:dibsId/delete",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    const { restaurantId, dibsId } = req.params;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await hardDeleteRestaurantDibs(
      restaurantId,
      dibsId,
      providerId,
      client
    );

    return res.json(result);
  }
);

export default router;
