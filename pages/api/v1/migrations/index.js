import migrationRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["POST", "GET"];
  if (!allowedMethods.includes(request.method)) {
    response.status(405).send({ error: `${request.method} not allowed` });
    return;
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultOptions = {
      //databaseUrl: process.env.DATABASE_URL, // Não é preciso utilizar já que utilizamos o dbClient
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultOptions);
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultOptions,
        dryRun: false,
      });
      const statusCode = migratedMigrations.length > 0 ? 201 : 200;
      return response.status(statusCode).json(migratedMigrations);
    }

    return response.status(405);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}
