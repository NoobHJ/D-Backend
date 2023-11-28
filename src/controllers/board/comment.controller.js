import { logger } from "../../utils/logger.util.js";
import {
  getTableIdQuery,
  createTableDataQuery,
  getTableDataQuery,
  updateTableDataQuery,
  softDeleteTableDataQuery,
} from "../../services/query.service.js";
import { verifyFields } from "../../services/verify.service.js";

async function createBoardComment(body, providerId, boardId, client) {
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

    body["user_id"] = userIdFromDb;
    body["board_id"] = boardId;

    await createTableDataQuery(body, "board_comments", client);

    return { message: "Success" };
  } catch (err) {
    logger.warn("Error in createBoard: " + err.message);
    throw err;
  } finally {
    client.release();
  }
}

async function getBoardComment(boardId, client) {
  try {
    const getBoardCommentData = await getTableDataQuery(
      "board_comments",
      {
        board_id: boardId,
      },
      client
    );

    return { message: "Success", boardComment: getBoardCommentData[0] };
  } catch (err) {
    logger.warn("Error in getBoardComment: " + err.message);

    throw err;
  } finally {
    client.release();
  }
}

async function updateBoardComment(
  boardId,
  commentId,
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

    await updateTableDataQuery(
      body,
      "board_comments",
      { id: commentId, user_id: userIdFromDb, board_id: boardId },
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

async function softdeleteBoardComment(boardId, commentId, providerId, client) {
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

    await softDeleteTableDataQuery(
      "board_comments",
      {
        id: commentId,
        user_id: userIdFromDb,
        board_id: boardId,
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
  createBoardComment,
  getBoardComment,
  updateBoardComment,
  softdeleteBoardComment,
};
