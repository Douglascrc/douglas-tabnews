import orchestrator from "tests/orchestrator.js";
import { faker } from "@faker-js/faker";

beforeAll(async () => {
  await orchestrator.waitAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/sessions", () => {
  test("No match password, but correct email", async () => {
    const testPassword = faker.internet.password();

    const createdUser = await orchestrator.createUser({
      email: "email.correto@mail.com",
    });

    const response = await fetch(`${process.env.WEB_SERVER}/api/v1/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "email.correto@mail.com",
        password: testPassword,
      }),
    });

    expect(response.status).toBe(401);
    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "UnauthorizedError",
      message: "Dados de autenticação não conferem",
      action: "Verifique os dados enviados",
      status_code: 401,
    });
  });

  test("Incorrect email, but correct password", async () => {
    const createdUser = await orchestrator.createUser();

    const response = await fetch(`${process.env.WEB_SERVER}/api/v1/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "email-incorreto@mail.com",
        password: createdUser.password,
      }),
    });

    expect(response.status).toBe(401);
    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "UnauthorizedError",
      message: "Dados de autenticação não conferem",
      action: "Verifique os dados enviados",
      status_code: 401,
    });
  });

  test("Incorrect email and incorrect password", async () => {
    const testPassword = faker.internet.password();

    await orchestrator.createUser();

    const response = await fetch(`${process.env.WEB_SERVER}/api/v1/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "email-incorreto@mail.com",
        password: testPassword,
      }),
    });

    expect(response.status).toBe(401);
    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "UnauthorizedError",
      message: "Dados de autenticação não conferem",
      action: "Verifique os dados enviados",
      status_code: 401,
    });
  });

  test("correct email and correct password", async () => {
    const testPassword = faker.internet.password();

    const createdUser = await orchestrator.createUser({
      email: "email-correto@mail.com",
      password: testPassword,
    });

    const response = await fetch(`${process.env.WEB_SERVER}/api/v1/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "email-correto@mail.com",
        password: testPassword,
      }),
    });

    expect(response.status).toBe(201);
  });
});
