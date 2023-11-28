import { Router } from "express";

import authenticateUser from "../../middlewares/auth.middleware.js";
import withDatabase from "../../middlewares/database.middleware.js";
import {
  getBoardDepthComment,
  createBoardDepthComment,
  updateBoardDepthcomment,
  softDeleteBoardDepthComment,
} from "../../controllers/board/depthcommnet.controller.js";

const router = Router();

router.post(
  "/:boardId/comment/:commentId/create",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    try {
      const { body } = req;
      const { commentId } = req.params;
      const { providerId } = req.user;
      const { client } = req.dbClient;
      const result = await createBoardDepthComment(
        body,
        providerId,
        commentId,
        client
      );

      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

router.get("/:boardId/comment/:commentId", withDatabase, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { client } = req.dbClient;
    const result = await getBoardDepthComment(commentId, client);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.patch(
  "/:boardId/comment/:commentId/depthcomment/:depthCommentId/update",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    try {
      const { boardId, commentId, depthCommentId } = req.params;
      const { body } = req;
      const { providerId } = req.user;
      const { client } = req.dbClient;
      const result = await updateBoardDepthcomment(
        boardId,
        commentId,
        depthCommentId,
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
  "/:boardId/comment/:commentId/depthcomment/:depthCommentId/soft-delete",
  authenticateUser,
  withDatabase,
  async (req, res) => {
    try {
      const { boardId, commentId, depthCommentId } = req.params;
      const { providerId } = req.user;
      const { client } = req.dbClient;
      const result = await softDeleteBoardDepthComment(
        boardId,
        commentId,
        depthCommentId,
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
