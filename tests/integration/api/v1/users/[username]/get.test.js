import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();

  await fetch(`${process.env.WEB_SERVER}/api/v1/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "douglasCampos",
      email: "douglas@mail.com",
      password: "1234",
    }),
  });
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const response = await fetch(
        `${process.env.WEB_SERVER}/api/v1/users/douglasCampos`,
      );

      expect(response.status).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).not.toHaveProperty("password");
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const response2 = await fetch(
        `${process.env.WEB_SERVER}/api/v1/users/douglasCAmpos`,
      );
      expect(response2.status).toBe(200);
      const response2Body = await response2.json();

      expect(response2Body).not.toHaveProperty("password");
    });

    test("With a mismatch", async () => {
      const response = await fetch(
        `${process.env.WEB_SERVER}/api/v1/users/caio`,
      );

      expect(response.status).toBe(404);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
