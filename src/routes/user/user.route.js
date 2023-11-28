import { Router } from "express";

import authenticateUser from "../../middlewares/auth.middleware.js";
import withDatabase from "../../middlewares/database.middleware.js";
import {
  getUser,
  updateUser,
  softDeleteUser,
} from "../../controllers/user/user.controller.js";

const router = Router();

router.get("/:userId", authenticateUser, withDatabase, async (req, res) => {
  try {
    const { userId } = req.params;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await getUser(userId, providerId, client);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.patch(
  "/:userId/update",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { body } = req;
      const { providerId } = req.user;
      const { client } = req.dbClient;
      const result = await updateUser(userId, body, providerId, client);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

router.patch(
  "/:userId/soft-delete",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { providerId } = req.user;
      const { client } = req.dbClient;
      const result = await softDeleteUser(userId, providerId, client);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

export default router;
