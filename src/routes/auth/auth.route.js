import { Router } from "express";
import dotenv from "dotenv";

import withDatabase from "../../middlewares/database.middleware.js";
import { handleAuthentication } from "../../controllers/auth/auth.controller.js";

dotenv.config();

const router = Router();

router.post("/login/google", withDatabase, async (req, res) => {
  try {
    const { user } = req.body;
    const { client } = req.dbClient;
    const provider = "google";
    const result = await handleAuthentication(user, provider, client);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

export default router;
