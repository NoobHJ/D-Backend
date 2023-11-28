import { logger } from "../../utils/logger.util.js";

async function createRestaurantTable(client) {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        detail VARCHAR,
        photo VARCHAR,
        address VARCHAR NOT NULL,
        latitude DECIMAL NOT NULL,
        longitude DECIMAL NOT NULL,
        deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT current_timestamp,
        deleted_at TIMESTAMP DEFAULT null,
        user_id INTEGER REFERENCES users(id) NOT NULL
      );`
    );

    logger.info("'restaurants' table created successfully!");
  } catch (err) {
    logger.warn("Error creating 'restaurants' table: " + err.message);

    throw err;
  }
}

export default createRestaurantTable;
