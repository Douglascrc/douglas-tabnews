import retry from "async-retry";
import database from "infra/database";
import migrator from "models/migrator.js";

async function waitAllServices() {
  await waitWebServer();

  async function waitWebServer() {
    retry(fetchStatusPage),
      {
        retries: 100,
        maxTimeout: 1000,
        onRetry: (error, attempt) => {
          console.log(
            `Attempt${attempt} - Failed to fetch status page: ${error.message}`,
          );
        },
      };
  }

  async function fetchStatusPage() {
    const response = await fetch(`${process.env.WEB_SERVER}/api/v1/status`);

    if (response.status != 200) {
      throw new Error();
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

const orchestrator = {
  waitAllServices,
  clearDatabase,
  runPendingMigrations,
};

export default orchestrator;
