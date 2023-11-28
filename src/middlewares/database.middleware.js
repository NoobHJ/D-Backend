import { pool } from "../configs/database.config.js";
import { logger } from "../utils/logger.util.js";

async function withDatabase(req, res, next) {
  const client = await pool.connect();

  try {
    req.dbClient = { client };

    next();
  } catch (err) {
    logger.warn(`withDatabase middleware error: ${err.message}`);

    next(err);
  }
}

export default withDatabase;
