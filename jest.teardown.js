import { pool } from "./src/configs/database.config.js";

async function resetTable() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DROP TABLE IF EXISTS restaurant_review_comments");
    await client.query("DROP TABLE IF EXISTS restaurant_reviews");
    await client.query("DROP TABLE IF EXISTS menus");
    await client.query("DROP TABLE IF EXISTS restaurant_stars");
    await client.query("DROP TABLE IF EXISTS restaurant_dibs");
    await client.query("DROP TABLE IF EXISTS restaurant_likes");
    await client.query("DROP TABLE IF EXISTS board_depth_comments");
    await client.query("DROP TABLE IF EXISTS board_comments");
    await client.query("DROP TABLE IF EXISTS boards");
    await client.query("DROP TABLE IF EXISTS restaurants");
    await client.query("DROP TABLE IF EXISTS business_infos");
    await client.query("DROP TABLE IF EXISTS users");

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

afterAll(async () => {
  await resetTable();
  await pool.end();
});
