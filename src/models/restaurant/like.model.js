import { logger } from "../../utils/logger.util.js";

async function createRestaurantLikeTable(client) {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS restaurant_likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        restaurant_id INTEGER REFERENCES restaurants(id),
        UNIQUE(user_id, restaurant_id)
      );`
    );

    logger.info("'restaurant_likes' table created successfully!");
  } catch (err) {
    logger.warn("Error creating 'restaurant_likes' table:" + err.message);

    throw err;
  }
}

export default createRestaurantLikeTable;
