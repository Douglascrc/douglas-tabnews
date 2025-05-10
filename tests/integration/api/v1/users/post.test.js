import { version as uuidVersion } from "uuid";
import database from "infra/database";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitAllServices();
  await orchestrator.runPendingMigrations();
  await database.query("DELETE FROM users");
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch(`${process.env.WEB_SERVER}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "douglasCampos",
          email: "douglas@mail.com",
          password: "1234",
        }),
      });

      expect(response.status).toBe(201);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: responseBody.username,
        email: responseBody.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With a duplicated email", async () => {
      const response = await fetch(`${process.env.WEB_SERVER}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "douglasCampos",
          email: "douglas@mail.com",
          password: "1234",
        }),
      });

      expect(response.status).toBe(400);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado!",
        action: "Verifique o email digitado!",
        status_code: 400,
      });
    });

    test("With a duplicated username", async () => {
      const response = await fetch(`${process.env.WEB_SERVER}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "douglasCampos",
          email: "doug@mail.com",
          password: "1234",
        }),
      });

      expect(response.status).toBe(400);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado!",
        action: "Verifique o username digitado!",
        status_code: 400,
      });
    });
  });
});
