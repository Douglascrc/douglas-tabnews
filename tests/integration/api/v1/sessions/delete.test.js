import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import session from "models/session.js";
import setCookieParser from "set-cookie-parser";
import crypto from "node:crypto";

beforeAll(async () => {
  await orchestrator.waitAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/sessions", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const createdUser = await orchestrator.createUser();

      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `${process.env.WEB_SERVER}/api/v1/sessions`,
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
          method: "DELETE",
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: sessionObject.id,
        token: sessionObject.token,
        user_id: sessionObject.user_id,
        expires_at: responseBody.expires_at,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(
        sessionObject.expires_at.toISOString() > responseBody.expires_at,
      ).toBe(true);
      expect(
        sessionObject.updated_at.toISOString() < responseBody.updated_at,
      ).toBe(true);

      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
      });

      const doubleCheckResponse = await fetch(
        `${process.env.WEB_SERVER}/api/v1/user`,
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        },
      );

      expect(doubleCheckResponse.status).toBe(401);
      const doubleCheckResponseBody = await doubleCheckResponse.json();

      expect(doubleCheckResponseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
        status_code: 401,
      });
    });

    test("With expired session", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILISECONDS),
      });

      const createdUser = await orchestrator.createUser({
        username: "UserWithExpiredSession",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        `${process.env.WEB_SERVER}/api/v1/sessions`,
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
          method: "DELETE",
        },
      );

      jest.useRealTimers();

      expect(response.status).toBe(401);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
        status_code: 401,
      });
    });

    test("With nonexistent session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UserWithNonExistSession",
      });

      let sessionObject = await orchestrator.createSession(createdUser.id);

      sessionObject.token = crypto.randomBytes(48).toString("hex");

      const response = await fetch(
        `${process.env.WEB_SERVER}/api/v1/sessions`,
        {
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
          method: "DELETE",
        },
      );

      expect(response.status).toBe(401);
      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
        status_code: 401,
      });
    });
  });
});
