import { Router } from "express";

import authenticateUser from "../../middlewares/auth.middleware.js";
import withDatabase from "../../middlewares/database.middleware.js";
import {
  createMenu,
  getMenu,
  editMenu,
  softDeleteMenu,
} from "../../controllers/restaurant/menu.controller.js";

const router = Router();

router.post(
  ":restaurantId/menu/create",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    const { restaurantId } = req.params;
    const { body } = req;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await createMenu(restaurantId, body, providerId, client);

    return res.json(result);
  }
);

router.get(":restaurantId/menu", withDatabase, async (req, res) => {
  const { restaurantId } = req.params;
  const { client } = req.dbClient;
  const result = await getMenu(restaurantId, client);

  return res.json(result);
});

router.patch(
  ":restaurantId/menu/:menuId",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    const { restaurantId } = req.params;
    const { menuId } = req.params;
    const { body } = req;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await editMenu(
      restaurantId,
      menuId,
      body,
      providerId,
      client
    );

    return res.json(result);
  }
);

router.patch(
  ":restaurantId/menu/:menuId/delete",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    const { restaurantId, menuId } = req.params;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await softDeleteMenu(
      restaurantId,
      menuId,
      providerId,
      client
    );

    return res.json(result);
  }
);

export default router;
