import { join } from "node:path";
import migrationsRunner from "node-pg-migrate";
import database from "infra/database.js";

import { ServiceError } from "infra/errors.js";

const defaultMigrationsRunner = {
  dir: join(process.cwd(), "infra", "migrations"),
  direction: "up",
  log: () => {},
  migrationsTable: "pgmigrations",
};

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationsRunner({
      ...defaultMigrationsRunner,
      dbClient: dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } catch (error) {
    const publicErrorObject = new ServiceError({
      cause: error,
      message: "Error ao executar as migrations",
    });
    throw publicErrorObject;
  } finally {
    await dbClient?.end();
  }
}

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationsRunner({
      ...defaultMigrationsRunner,
      dbClient: dbClient,
      dryRun: true,
    });

    return pendingMigrations;
  } catch (error) {
    const publicErrorObject = new ServiceError({
      cause: error,
      message: "Error ao executar migrações",
    });
    throw publicErrorObject;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
