import database from "infra/database";

async function status(request, response) {
  let updatedAt = new Date().toISOString();
  let databaseSettings = {};
  const databaseName = process.env.POSTGRES_DB;

  try {
    let databaseResult = await database.query({
      text: `SELECT current_setting('server_version')::FLOAT AS version, 
      current_setting('max_connections')::INT AS max_connections,
      COUNT(*)::INT AS used_connections
      FROM pg_stat_activity WHERE datname = $1;`,
      values: [databaseName],
    });

    databaseSettings = {
      database_status: "healthy",
      ...databaseResult.rows[0],
    };
  } catch (error) {
    databaseSettings = {
      database_status: "unhealthy",
    };
  }

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database_info: databaseSettings,
    },
  });
}

export default status;
