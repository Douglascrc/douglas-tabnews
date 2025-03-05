import database from "infra/database";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  let updatedAt = new Date().toISOString();
  let databaseSettings = {};
  const databaseName = process.env.POSTGRES_DB;

  if (request.method != "GET") {
    return response.status(405).json({ message: "METHOD NOT ALLOWED" });
  }

  try {
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
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.error(publicErrorObject);
    response.status(500).json(publicErrorObject);
  }
}

export default status;
