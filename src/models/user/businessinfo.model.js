import { logger } from "../../utils/logger.util.js";

async function createBusinessInfoTable(client) {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS business_infos (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id)
        );`
    );

    logger.info("'business_infos' table created successfully!");
  } catch (err) {
    logger.warn("Error creating 'business_infos' table: " + err.message);

    throw err;
  }
}

export default createBusinessInfoTable;
