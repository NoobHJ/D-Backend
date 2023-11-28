import { logger } from "../utils/logger.util.js";

const allowedTableNames = [
  "users",
  "business_infos",
  "restaurants",
  "menus",
  "board_depth_comments",
  "board_comments",
  "restaurant_likes",
  "boards",
  "restaurant_dibs",
  "restaurant_reviews",
];

async function getTableIdQuery(tableName, where, client, existCheck = false) {
  try {
    if (!allowedTableNames.includes(tableName)) {
      logger.warn(`Invalid table name(allowedTableNames): ${tableName}`);

      throw new Error(`Invalid table name`);
    }

    const whereClauses = Object.entries(where)
      .map(([field, value], index) => `${field} = $${index + 1}`)
      .join(" AND ");

    const getTableIdSql = `SELECT id FROM ${tableName} WHERE ${whereClauses}`;
    const params = Object.values(where);

    const getTableIdResult = await client.query(getTableIdSql, params);

    if (!existCheck && getTableIdResult.rows.length < 1) {
      logger.warn(`No rows found in ${tableName} with the provided conditions`);

      throw new Error(`No rows found with the provided conditions`);
    }

    if (existCheck && getTableIdResult.rows.length < 1) {
      return null;
    }

    logger.info(`Successfully retrieved id from ${tableName} with criteria`);

    return getTableIdResult.rows[0].id;
  } catch (err) {
    logger.warn("getTableIdQuery: " + err.message);

    throw err;
  }
}

async function getTableDataQuery(tableName, where, client) {
  try {
    if (!allowedTableNames.includes(tableName)) {
      logger.warn(`Invalid table name(allowedTableNames): ${tableName}`);

      throw new Error(`Invalid table name`);
    }

    let getSql = `SELECT * FROM ${tableName}`;
    let params = [];

    if (Object.keys(where).length > 0) {
      const whereClauses = Object.entries(where)
        .map(([field, value], index) => `${field} = $${index + 1}`)
        .join(" AND ");

      getSql += ` WHERE ${whereClauses}`;
      params = Object.values(where);
    }

    const getTableDataResult = await client.query(getSql, params);

    if (getTableDataResult.rows.length < 1) {
      logger.warn(`No data found in ${tableName} with the provided criteria`);

      throw new Error(`No data found with the provided criteria`);
    }

    logger.info(`Successfully retrieved data from ${tableName} with criteria`);

    return getTableDataResult.rows;
  } catch (err) {
    logger.warn("getTableDataQuery: " + err.message);

    throw err;
  }
}

async function createTableDataQuery(body, tableName, client) {
  const allowedColumns = {
    boards: [
      "title",
      "detail",
      "picture",
      "recruit",
      "user_id",
      "restaurant_id",
    ],
    restaurants: [
      "name",
      "detail",
      "photo",
      "address",
      "latitude",
      "longitude",
      "user_id",
    ],
    menus: ["name", "detail", "price", "photo", "restaurant_id"],
    board_comments: ["comment", "user_id", "board_id"],
    board_depth_comments: ["comment", "user_id", "board_comment_id"],
    restaurant_likes: ["user_id", "restaurant_id"],
    users: [
      "email",
      "username",
      "nickname",
      "profile_image",
      "provider",
      "provider_id",
    ],
    restaurant_dibs: ["user_id", "restaurant_id"],
    restaurant_reviews: ["photo", "detail", "user_id", "restaurant_id"],
  };

  try {
    if (!allowedTableNames.includes(tableName)) {
      throw new Error(`Invalid table name(allowedTableNames): ${tableName}`);
    }

    if (!allowedColumns.hasOwnProperty(tableName)) {
      throw new Error(`Invalid table name(allowedColumns): ${tableName}`);
    }

    const bodyKeys = Object.keys(body);
    if (!bodyKeys.every((key) => allowedColumns[tableName].includes(key))) {
      throw new Error(`Invalid column in the provided data.`);
    }

    const fields = bodyKeys;
    const values = fields.map((_, index) => `$${index + 1}`);
    const params = fields.map((field) => body[field]);

    const insertSql = `
      INSERT INTO ${tableName} (${fields.join(", ")})
      VALUES (${values.join(", ")})
    `;

    const createTableDataResult = await client.query(insertSql, params);

    if (createTableDataResult.rowCount < 1) {
      throw new Error("No data was found to create in " + tableName);
    }

    logger.info("Data in " + tableName + " successfully inserted");

    return;
  } catch (err) {
    logger.warn("createTableDataQuery: " + err.message);

    throw err;
  }
}

async function updateTableDataQuery(body, tableName, where, client) {
  const allowedColumns = {
    users: [
      "nickname",
      "profile_image",
      "gender",
      "age",
      "latitude",
      "longitude",
    ],
    boards: ["title", "detail", "picture", "recruit", "restaurant_id"],
    board_comments: ["comment"],
    restaurants: [
      "name",
      "detail",
      "photo",
      "address",
      "latitude",
      "longitude",
    ],
    menus: ["name", "detail", "price", "photo"],
    board_depth_comments: ["comment"],
    restaurant_reviews: ["photo", "detail"],
  };

  try {
    if (!allowedTableNames.includes(tableName)) {
      logger.warn(`Invalid table name(allowedTableNames): ${tableName}`);

      throw new Error(`Invalid table name`);
    }

    if (!allowedColumns.hasOwnProperty(tableName)) {
      logger.warn(`Invalid table name(allowedColumns): ${tableName}`);

      throw new Error(`Invalid table name`);
    }

    const bodyKeys = Object.keys(body);
    if (!bodyKeys.every((key) => allowedColumns[tableName].includes(key))) {
      logger.warn(`Invalid column in the provided data`);

      throw new Error(`Invalid column in the provided data`);
    }

    const updates = Object.entries(body)
      .map(([field, value], index) => `${field} = $${index + 1}`)
      .join(", ");

    const whereClauses = Object.entries(where)
      .map(([field, value], index) => {
        return `${field} = $${Object.keys(body).length + index + 1}`;
      })
      .join(" AND ");

    const params = [...Object.values(body), ...Object.values(where)];
    const updateSql = `UPDATE ${tableName} SET ${updates} WHERE ${whereClauses}`;

    const updateTableDataResult = await client.query(updateSql, params);

    if (updateTableDataResult.rowCount < 1) {
      logger.warn("No data was found to update in " + tableName);

      throw new Error("No data was found to update in table");
    }

    logger.info("Data in " + tableName + " successfully updated");

    return;
  } catch (err) {
    logger.warn("updateTableDataQuery: " + err.message);

    throw err;
  }
}

async function softDeleteTableDataQuery(tableName, where, client) {
  try {
    if (!allowedTableNames.includes(tableName)) {
      logger.warn(`Invalid table name(allowedTableNames): ${tableName}`);

      throw new Error(`Invalid table name`);
    }

    const whereClause = Object.entries(where)
      .map(([field, value], index) => `${field} = $${index + 1}`)
      .join(" AND ");

    const softDeleteSql = `UPDATE ${tableName} SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE ${whereClause}`;
    const params = Object.values(where);
    const softDeleteTableDataResult = await client.query(softDeleteSql, params);

    if (softDeleteTableDataResult.rowCount < 1) {
      logger.warn("No data was found to delete in " + tableName);

      throw new Error("No data was found to delete in table");
    }

    logger.info("Data in " + tableName + " successfully soft-deleted");

    return;
  } catch (err) {
    logger.warn("softDeleteTableDataQuery: " + err.message);

    throw err;
  }
}

async function hardDeleteTableDataQuery(tableName, where, client) {
  const allowedDeleteTableNames = ["restaurant_likes", "restaurant_dibs"];

  try {
    if (!allowedDeleteTableNames.includes(tableName)) {
      throw new Error(`Invalid table name(allowedTableNames): ${tableName}`);
    }

    const whereClauses = Object.entries(where)
      .map(([field, value], index) => `${field} = $${index + 1}`)
      .join(" AND ");

    const params = Object.values(where);
    const deleteSql = `DELETE FROM ${tableName} WHERE ${whereClauses}`;

    const deleteTableDataResult = await client.query(deleteSql, params);

    if (deleteTableDataResult.rowCount < 1) {
      logger.warn("No data was found to delete in " + tableName);

      throw new Error("No data was found to delete in " + tableName);
    }

    logger.info("Data in " + tableName + " successfully hard-deleted");

    return { message: "Data in " + tableName + " successfully hard-deleted" };
  } catch (err) {
    logger.warn("hardDeleteTableDataQuery: " + err.message);

    throw err;
  }
}

export {
  getTableIdQuery,
  getTableDataQuery,
  createTableDataQuery,
  updateTableDataQuery,
  softDeleteTableDataQuery,
  hardDeleteTableDataQuery,
};
