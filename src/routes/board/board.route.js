import { Router } from "express";

import authenticateUser from "../../middlewares/auth.middleware.js";
import withDatabase from "../../middlewares/database.middleware.js";
import {
  createBoard,
  getBoard,
  updateBoard,
  softDeleteBoard,
} from "../../controllers/board/board.controller.js";

const router = Router();

router.post("/create", authenticateUser, withDatabase, async (req, res) => {
  try {
    const { body } = req;
    const { providerId } = req.user;
    const { client } = req.dbClient;
    const result = await createBoard(body, providerId, client);

    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.get("/:boardId", withDatabase, async (req, res) => {
  try {
    const { boardId } = req.params;
    const { client } = req.dbClient;
    const result = await getBoard(boardId, client);

    // if (!result.board) {
    //   return res.status(404).json({ message: result.message });
    // }
    // console.log(!result.board);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.patch(
  "/:boardId/update",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    try {
      const { boardId } = req.params;
      const { body } = req;
      const { providerId } = req.user;
      const { client } = req.dbClient;
      const result = await updateBoard(boardId, body, providerId, client);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

router.patch(
  "/:boardId/soft-delete",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    try {
      const { boardId } = req.params;
      const { providerId } = req.user;
      const { client } = req.dbClient;
      const result = await softDeleteBoard(boardId, providerId, client);

      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

export default router;
