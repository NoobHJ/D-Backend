import { logger } from "../../utils/logger.util.js";
import {
  getTableIdQuery,
  createTableDataQuery,
  getTableDataQuery,
  updateTableDataQuery,
  softDeleteTableDataQuery,
} from "../../services/query.service.js";

async function createMenu(restaurantId, body, providerId, client) {
  try {
    const userIdFromDb = await getTableIdQuery(
      "users",
      {
        provider_id: providerId,
      },
      client
    );

    if (!userIdFromDb) {
      logger.warn(`User not found with provided provider_id: ${providerId}`);
      throw new Error("User not found with provided provider_id");
    }

    const restaurantIdFromDb = await getTableIdQuery(
      "restaurants",
      {
        id: restaurantId,
        user_id: userIdFromDb,
      },
      client
    );

    if (!restaurantIdFromDb) {
      logger.warn(
        "Restaurant not found with provided restaurant_id: " +
          restaurantIdFromDb
      );

      throw new Error(
        "Restaurant not found with provided restaurant_id: " +
          restaurantIdFromDb
      );
    }

    body["restaurant_id"] = restaurantIdFromDb;

    const createMenuData = await createTableDataQuery(body, "menus", client);

    return createMenuData;
  } catch (err) {
    logger.warn("Error in createMenu: " + err.message);

    return { message: "Error in createMenu: " + err.message };
  }
}

async function getMenu(restaurantId, client) {
  try {
    const getMenuData = await getTableDataQuery(
      "menus",
      { restaurant_id: restaurantId },
      client
    );

    return getMenuData;
  } catch (err) {
    logger.warn("Error in getMenu: " + err.message);

    return { message: "Error in getMenu: " + err.message };
  }
}

async function editMenu(restaurantId, menuId, body, providerId, client) {
  try {
    const userIdFromDb = await getTableIdQuery("users", {
      provider_id: providerId,
    });

    if (!userIdFromDb) {
      logger.warn(`User not found with provided provider_id: ${providerId}`);
      throw new Error("User not found with provided provider_id");
    }

    const restaurantIdFromDb = await getTableIdQuery(
      "restaurants",
      {
        id: restaurantId,
        user_id: userIdFromDb,
      },
      client
    );

    if (!restaurantIdFromDb) {
      logger.warn(
        "Restaurant not found with provided restaurant_id: " +
          restaurantIdFromDb
      );

      throw new Error(
        "Restaurant not found with provided restaurant_id: " +
          restaurantIdFromDb
      );
    }

    const editMenuData = await updateTableDataQuery(
      body,
      "menus",
      {
        id: menuId,
        restaurant_id: restaurantIdFromDb,
      },
      client
    );

    return editMenuData;
  } catch (err) {
    logger.warn("Error in editMenu: " + err.message);

    return { message: "Error in editMenu: " + err.message };
  }
}

async function softDeleteMenu(restaurantId, menuId, providerId, client) {
  try {
    const userIdFromDb = await getTableIdQuery(
      "users",
      {
        provider_id: providerId,
      },
      client
    );

    if (!userIdFromDb) {
      logger.warn(`User not found with provided provider_id: ${providerId}`);
      throw new Error("User not found with provided provider_id");
    }

    const restaurantIdFromDb = await getTableIdQuery(
      "restaurants",
      {
        id: restaurantId,
        user_id: userIdFromDb,
      },
      client
    );

    if (!restaurantIdFromDb) {
      logger.warn(
        "Restaurant not found with provided restaurant_id: " +
          restaurantIdFromDb
      );

      throw new Error(
        "Restaurant not found with provided restaurant_id: " +
          restaurantIdFromDb
      );
    }

    const softDeleteMenu = await softDeleteTableDataQuery(
      "menus",
      {
        id: menuId,
        restaurant_id: restaurantIdFromDb,
      },
      client
    );

    return softDeleteMenu;
  } catch (err) {
    logger.warn("Error in editMenu: " + err.message);

    return { message: "Error in editMenu: " + err.message };
  }
}

export { createMenu, getMenu, editMenu, softDeleteMenu };
