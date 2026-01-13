import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersion = await database.query("SHOW server_version;");
  const versionResult = databaseVersion.rows[0].server_version;

  const databaseMaxConnections = await database.query("SHOW max_connections;");
  const maxConnections = parseInt(
    databaseMaxConnections.rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnections = await database.query({
    text: "SELECT count(*)::int AS opened_connections FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsResult =
    databaseOpenedConnections.rows[0].opened_connections;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_connections: maxConnections,
        opened_connections: databaseOpenedConnectionsResult,
        version: versionResult,
      },
    },
  });
}

export default status; //Função para o Next interpretar
