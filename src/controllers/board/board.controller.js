import { logger } from "../../utils/logger.util.js";
import {
  getTableIdQuery,
  createTableDataQuery,
  getTableDataQuery,
  updateTableDataQuery,
  softDeleteTableDataQuery,
} from "../../services/query.service.js";
import { verifyFields } from "../../services/verify.service.js";

async function createBoard(body, providerId, client) {
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

    const missingFields = await verifyFields(body, [
      "title",
      "detail",
      "picture",
    ]);

    if (missingFields.length > 0) {
      throw new Error(
        "Missing necessary board data: " + missingFields.join(", ")
      );
    }

    body["user_id"] = userIdFromDb;

    await createTableDataQuery(body, "boards", client);

    return { message: "Success" };
  } catch (err) {
    logger.warn("Error in createBoard: " + err.message);
    throw err;
  } finally {
    client.release();
  }
}

async function getBoard(boardId, client) {
  try {
    const getBoardData = await getTableDataQuery(
      "boards",
      {
        id: boardId,
      },
      client
    );

    return { message: "Success", board: getBoardData[0] };
  } catch (err) {
    logger.warn("Error in getBoard: " + err.message);
    throw err;
  } finally {
    client.release();
  }
}

async function updateBoard(boardId, body, providerId, client) {
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
      "boards",
      {
        id: boardId,
        user_id: userIdFromDb,
      },
      client
    );

    return { message: "Success" };
  } catch (err) {
    logger.warn("Error in updateBoard: " + err.message);

    throw err;
  } finally {
    client.release();
  }
}

async function softDeleteBoard(boardId, providerId, client) {
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
      "boards",
      {
        id: boardId,
        user_id: userIdFromDb,
      },
      client
    );

    return { message: "Success" };
  } catch (err) {
    logger.warn("Error in softDeleteBoard: " + err.message);

    throw err;
  } finally {
    client.release();
  }
}

export { createBoard, getBoard, updateBoard, softDeleteBoard };
