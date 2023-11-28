import { logger } from "../../utils/logger.util.js";

async function createRestaurantStarTable(client) {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS restaurant_stars (
        id SERIAL PRIMARY KEY,
        taste SMALLINT,
        price SMALLINT,
        service SMALLINT,
        user_id INTEGER REFERENCES users(id),
        restaurant_id INTEGER REFERENCES restaurants(id)
      );`
    );

    logger.info("'restaurant_stars' table created successfully!");
  } catch (err) {
    logger.warn("Error creating 'restaurant_stars' table: " + err.message);

    throw err;
  }
}

export default createRestaurantStarTable;
