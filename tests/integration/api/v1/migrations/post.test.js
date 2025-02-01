import database from "infra/database";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  cleanDatabase;
  await orchestrator.waitAllServices();
});

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST localhost:3000/api/v1/migrations", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(response.status).toBe(201);
  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
});
