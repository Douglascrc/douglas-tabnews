import retry from "async-retry";
import database from "infra/database";
import migrator from "models/migrator.js";
import user from "models/user.js";
import { faker } from "@faker-js/faker";
import session from "models/session.js";
import activation from "models/activation.js";

const emailHttpUrl = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function waitAllServices() {
  await waitWebServer();
  await waitEmailServer();

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
    async function fetchStatusPage() {
      const response = await fetch(`${process.env.WEB_SERVER}/api/v1/status`);

      if (response.status != 200) {
        throw new Error();
      }
    }
  }

  async function waitEmailServer() {
    retry(fetchEmailPage),
      {
        retries: 100,
        maxTimeout: 1000,
        onRetry: (error, attempt) => {
          console.log(
            `Attempt${attempt} - Failed to fetch email page: ${error.message}`,
          );
        },
      };

    async function fetchEmailPage() {
      const response = await fetch(emailHttpUrl);

      if (response.status != 200) {
        throw new Error();
      }
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

async function createSession(userId) {
  const newSession = session.create(userId);
  return newSession;
}

async function deleteAllEmails() {
  await fetch(`${emailHttpUrl}/messages`, {
    method: "DELETE",
  });
}

async function getLastEmail() {
  const emailListResponse = await fetch(`${emailHttpUrl}/messages`);
  const emailListResponseBody = await emailListResponse.json();
  const lastEmailItem = emailListResponseBody.pop();

  if (!lastEmailItem?.id) {
    return null;
  }

  const emailTextResponse = await fetch(
    `${emailHttpUrl}/messages/${lastEmailItem.id}.plain`,
  );
  const emailTextBody = await emailTextResponse.text();
  lastEmailItem.text = emailTextBody;

  return lastEmailItem;
}

async function extractUUID() {
  const lastEmail = await getLastEmail();

  const match = lastEmail?.text?.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i,
  );

  if (!match) {
    return null;
  }

  const activationToken = await activation.findOneValidById(match[0]);

  return {
    ...activationToken,
  };
}

async function activationUser(inactivateUser) {
  return await activation.activateUserById(inactivateUser.id);
}

const orchestrator = {
  waitAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  createSession,
  deleteAllEmails,
  getLastEmail,
  extractUUID,
  activationUser,
};

export default orchestrator;
