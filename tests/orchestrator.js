import retry from "async-retry";
import database from "infra/database";
import migrator from "models/migrator.js";
import user from "models/user.js";
import { faker } from "@faker-js/faker";

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

async function createUser(userObject) {
  return await user.create({
    username:
      userObject?.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject?.email || faker.internet.email(),
    password: userObject?.password || faker.internet.password(),
  });
}

const orchestrator = {
  waitAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
};

export default orchestrator;
