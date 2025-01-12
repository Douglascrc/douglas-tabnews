import database from "infra/database";

async function status(request, response) {
  let updatedAt = new Date().toISOString();
  let databaseSettings = {};

  try {
    let databaseResult = await database.query(
      `SELECT current_setting('server_version') AS version, 
      current_setting('max_connections') AS max_connections,
      COUNT(*) AS used_connections
      FROM pg_stat_activity`,
    );

    databaseSettings = databaseResult.rows[0];
  } catch (error) {
    databaseSettings = {
      databaseStatus: "Disconnected",
    };
  }

  response.status(200).json({
    updated_at: updatedAt,
    database_settings: databaseSettings,
  });
}

export default status;
