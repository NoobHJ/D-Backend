import { logger } from "../../utils/logger.util.js";

async function createBoardDepthCommentTable(client) {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS board_depth_comments (
        id SERIAL PRIMARY KEY,
        comment VARCHAR,
        deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT current_timestamp,
        deleted_at TIMESTAMP DEFAULT null,
        user_id INTEGER REFERENCES users(id),
        board_comment_id INTEGER REFERENCES board_comments(id)
      );`
    );

    logger.info("'board_depth_comments' table created successfully!");
  } catch (err) {
    logger.warn("Error creating 'board_depth_comments' table: " + err.message);

    throw err;
  }
}

export default createBoardDepthCommentTable;
