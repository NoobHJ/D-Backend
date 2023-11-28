import { logger } from "../../utils/logger.util.js";

async function createRestaurantReviewTable(client) {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS restaurant_reviews (
        id SERIAL PRIMARY KEY,
        photo VARCHAR,
        detail VARCHAR,
        deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT current_timestamp,
        deleted_at TIMESTAMP DEFAULT null,
        user_id INTEGER REFERENCES users(id),
        restaurant_id INTEGER REFERENCES restaurants(id)
      );`
    );

    logger.info("'restaurant_reviews' table created successfully!");
  } catch (err) {
    logger.warn("Error creating 'restaurant_reviews' table: " + err.message);

    throw err;
  }
}

export default createRestaurantReviewTable;
