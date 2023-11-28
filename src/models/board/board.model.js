import { logger } from "../../utils/logger.util.js";

async function createBoardTable(client) {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS boards (
        id SERIAL PRIMARY KEY,
        title VARCHAR,
        detail VARCHAR,
        picture VARCHAR,
        recruit SMALLINT,
        recruited SMALLINT,
        views INTEGER DEFAULT 0,
        deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT current_timestamp,
        deleted_at TIMESTAMP DEFAULT null,
        user_id INTEGER REFERENCES users(id),
        restaurant_id INTEGER REFERENCES restaurants(id) NULL
      );`
    );

    logger.info("'boards' table created successfully!");
  } catch (err) {
    logger.warn("Error creating 'boards' table: " + err.message);

    throw err;
  }
}

export default createBoardTable;
