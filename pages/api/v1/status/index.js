import { createRouter } from "next-connect";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();
  let databaseSettings = {};
  const databaseName = process.env.POSTGRES_DB;

  let databaseResult = await database.query({
    text: `SELECT current_setting('server_version')::FLOAT AS version, 
      current_setting('max_connections')::INT AS max_connections,
      COUNT(*)::INT AS opened_connections
      FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });

  databaseSettings = {
    ...databaseResult.rows[0],
  };

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database_info: databaseSettings,
    },
  });
}
