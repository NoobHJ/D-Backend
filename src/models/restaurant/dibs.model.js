import { logger } from "../../utils/logger.util.js";

async function createRestaurantDibsTable(client) {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS restaurant_dibs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        restaurant_id INTEGER REFERENCES restaurants(id),
        UNIQUE(user_id, restaurant_id)
      );`
    );

    logger.info("'restaurant_dibs' table created successfully!");
  } catch (err) {
    logger.warn("Error creating 'restaurant_dibs' table:" + err.message);

    throw err;
  }
}

export default createRestaurantDibsTable;
