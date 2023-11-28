import { logger } from "../../utils/logger.util.js";

async function createBoardCommentTable(client) {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS board_comments (
        id SERIAL PRIMARY KEY,
        comment VARCHAR,
        deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT current_timestamp,
        deleted_at TIMESTAMP DEFAULT null,
        user_id INTEGER REFERENCES users(id),
        board_id INTEGER REFERENCES boards(id)
      );`
    );

    logger.info("'board_comments' table created successfully!");
  } catch (err) {
    logger.warn("Error creating 'board_comments' table: " + err.message);

    throw err;
  }
}

export default createBoardCommentTable;
