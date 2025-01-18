import migrationsRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsRunner = {
      dbClient: dbClient,
      dir: join("infra", "migrations"),
      dryRun: true,
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const PendingMigrations = await migrationsRunner(defaultMigrationsRunner);
      return response.status(200).json(PendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationsRunner({
        ...defaultMigrationsRunner,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
    }
    return response.status(405).end();
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error.message });
  } finally {
    await dbClient.end();
  }
}
