import { Router } from "express";

import authenticateUser from "../../middlewares/auth.middleware.js";
import withDatabase from "../../middlewares/database.middleware.js";
import {
  createBoardComment,
  getBoardComment,
  updateBoardComment,
  softdeleteBoardComment,
} from "../../controllers/board/comment.controller.js";

const router = Router();

router.post(
  "/:boardId/comment/create",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    try {
      const { body } = req;
      const { boardId } = req.params;
      const { providerId } = req.user;
      const { client } = req.dbClient;
      const result = await createBoardComment(
        body,
        providerId,
        boardId,
        client
      );

      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

router.get("/:boardId/comment", withDatabase, async (req, res) => {
  try {
    const { boardId } = req.params;
    const { client } = req.dbClient;
    const result = await getBoardComment(boardId, client);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.patch(
  "/:boardId/comment/:commentId/update",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    try {
      const { boardId, commentId } = req.params;
      const { body } = req;
      const providerId = req.user.providerId;
      const { client } = req.dbClient;
      const result = await updateBoardComment(
        boardId,
        commentId,
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
  "/:boardId/comment/:commentId/soft-delete",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    try {
      const { boardId, commentId } = req.params;
      const { providerId } = req.user;
      const { client } = req.dbClient;
      const result = await softdeleteBoardComment(
        boardId,
        commentId,
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
