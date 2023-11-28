import { logger } from "../../utils/logger.util.js";

async function createRestaurantMenuTable(client) {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        name VARCHAR,
        detail VARCHAR,
        price MONEY,
        photo VARCHAR,
        deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT current_timestamp,
        deleted_at TIMESTAMP DEFAULT null,
        restaurant_id INTEGER REFERENCES restaurants(id)
      );`
    );

    logger.info("'menus' table created successfully!");
  } catch (err) {
    logger.warn("Error creating 'menus' table: " + err.message);

    throw err;
  }
}

export default createRestaurantMenuTable;
