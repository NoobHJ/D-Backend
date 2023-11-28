import { Router } from "express";

import authenticateUser from "../../middlewares/auth.middleware.js";
import withDatabase from "../../middlewares/database.middleware.js";
import {
  createRestaurant,
  updateRestaurant,
  getAllRestaurant,
  getRestaurant,
  softDeleteRestaurant,
} from "../../controllers/restaurant/restaurant.controller.js";

const router = Router();

router.post("/create", authenticateUser, withDatabase, async (req, res) => {
  try {
    const { body } = req;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await createRestaurant(body, providerId, client);

    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.get("/all", withDatabase, async (req, res) => {
  try {
    const { client } = req.dbClient;
    const result = await getAllRestaurant(client);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.get("/:restaurantId", withDatabase, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { client } = req.dbClient;
    const result = await getRestaurant(restaurantId, client);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.patch(
  "/:restaurantId/update",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const { body } = req;
      const { providerId } = req.user;
      const { client } = req.dbClient;
      const result = await updateRestaurant(
        restaurantId,
        body,
        providerId,
        client
      );

      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

router.patch(
  "/:restaurantId/soft-delete",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const { providerId } = req.user;
      const { client } = req.dbClient;
      const result = await softDeleteRestaurant(
        restaurantId,
        providerId,
        client
      );

      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

export default router;
