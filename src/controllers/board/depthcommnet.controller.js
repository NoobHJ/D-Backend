import { logger } from "../../utils/logger.util.js";
import {
  getTableIdQuery,
  createTableDataQuery,
  getTableDataQuery,
  updateTableDataQuery,
  softDeleteTableDataQuery,
} from "../../services/query.service.js";
import { verifyFields } from "../../services/verify.service.js";

async function createBoardDepthComment(body, providerId, commentId, client) {
  try {
    if (!body || Object.keys(body).length === 0) {
      throw new Error("Body data is not provided");
    }
    const userIdFromDb = await getTableIdQuery(
      "users",
      {
        provider_id: providerId,
      },
      client
    );

    if (!userIdFromDb) {
      logger.warn(`User not found with provided provider_id: ${providerId}`);
      throw new Error("User not found with provided provider_id");
    }

    const missingFields = await verifyFields(body, ["comment"]);
    if (missingFields.length > 0) {
      throw new Error(
        "Missing necessary board data: " + missingFields.join(", ")
      );
    }

    body["user_id"] = userIdFromDb;
    body["board_comment_id"] = commentId;

    await createTableDataQuery(body, "board_depth_comments", client);

    return { message: "Success" };
  } catch (err) {
    logger.warn("Error in createBoard: " + err.message);
    throw err;
  } finally {
    client.release();
  }
}

async function getBoardDepthComment(commentId, client) {
  try {
    const getBoardDepthCommentData = await getTableDataQuery(
      "board_depth_comments",
      {
        board_comment_id: commentId,
      },
      client
    );

    return {
      message: "Success",
      BoardDepthComment: getBoardDepthCommentData[0],
    };
  } catch (err) {
    logger.warn("Error in getBoardComment: " + err.message);

    throw err;
  } finally {
    client.release();
  }
}

async function updateBoardDepthcomment(
  boardId,
  commentId,
  depthCommentId,
  body,
  providerId,
  client
) {
  try {
    const userIdFromDb = await getTableIdQuery(
      "users",
      {
        provider_id: providerId,
      },
      client
    );

    if (!userIdFromDb) {
      logger.warn(`User not found with provided provider_id: ${providerId}`);
      throw new Error("User not found with provided provider_id");
    }

    const boardIdFromDb = await getTableIdQuery(
      "boards",
      {
        id: boardId,
      },
      client
    );

    if (!boardIdFromDb) {
      logger.warn(
        "Board not found with provided provider_id: " + boardIdFromDb
      );

      throw new Error(
        "Board not found with provided provider_id: " + boardIdFromDb
      );
    }

    await updateTableDataQuery(
      body,
      "board_depth_comments",
      {
        id: depthCommentId,
        board_comment_id: commentId,
        user_id: userIdFromDb,
      },
      client
    );

    return { message: "Success" };
  } catch (err) {
    logger.warn("Error in updateBoardComment: " + err.message);

    throw err;
  } finally {
    client.release();
  }
}

async function softDeleteBoardDepthComment(
  boardId,
  commentId,
  depthCommentId,
  providerId,
  client
) {
  try {
    const userIdFromDb = await getTableIdQuery(
      "users",
      {
        provider_id: providerId,
      },
      client
    );

    if (!userIdFromDb) {
      logger.warn(`User not found with provided provider_id: ${providerId}`);
      throw new Error("User not found with provided provider_id");
    }

    const boardIdFromDb = await getTableIdQuery(
      "boards",
      {
        id: boardId,
      },
      client
    );

    if (!boardIdFromDb) {
      logger.warn(
        "Board not found with provided provider_id: " + boardIdFromDb
      );

      throw new Error(
        "Board not found with provided provider_id: " + boardIdFromDb
      );
    }

    await softDeleteTableDataQuery(
      "board_depth_comments",
      {
        id: depthCommentId,
        board_comment_id: commentId,
        user_id: userIdFromDb,
      },
      client
    );

    return { message: "Success" };
  } catch (err) {
    logger.warn("Error in softDeleteBoardComment: " + err.message);

    throw err;
  } finally {
    client.release();
  }
}

export {
  getBoardDepthComment,
  createBoardDepthComment,
  updateBoardDepthcomment,
  softDeleteBoardDepthComment,
};
