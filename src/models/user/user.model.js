import { logger } from "../../utils/logger.util.js";

async function createUsersTable(client) {
  try {
    await client.query(
      `
      DO $$ 
      BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN 
            CREATE TYPE role_enum AS ENUM (
                'business',
                'general',
                'admin'
            );
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'provider_enum') THEN 
            CREATE TYPE provider_enum AS ENUM (
                'kakao',
                'google',
                'apple'
            );
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_enum') THEN 
            CREATE TYPE gender_enum AS ENUM (
                'male',
                'female'
            );
        END IF;
      END $$;

        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR UNIQUE NOT NULL,
            username VARCHAR NOT NULL,
            nickname VARCHAR UNIQUE NOT NULL,
            gender gender_enum DEFAULT NULL,
            age SMALLINT DEFAULT NULL,
            profile_image VARCHAR,
            role role_enum DEFAULT 'general',
            provider provider_enum NOT NULL,
            provider_id VARCHAR NOT NULL,
            latitude DECIMAL DEFAULT NULL,
            longitude DECIMAL DEFAULT NULL,
            deleted BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT current_timestamp,
            deleted_at TIMESTAMP DEFAULT NULL
        );`
    );

    logger.info("'users' table created successfully!");
  } catch (err) {
    logger.warn("Error creating 'users' table: " + err.message);

    throw err;
  }
}

export default createUsersTable;
