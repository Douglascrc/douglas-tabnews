import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitAllServices();
});

describe("GET /api/v1/status", () => {
  test("Forbidden other HTTP methods", async () => {
    const response = await fetch(`${process.env.WEB_SERVER}/api/v1/status`, {
      method: "POST",
    });
    expect(response.status).toBe(405);

    const responseBody = await response.json();
    expect(responseBody).toEqual({
      name: "Method Not Allowed Error",
      message: "Método não permitido para esse endpoint",
      action: "Verifique se o método HTTP é válido para esse endpoint",
      status_code: 405,
    });
  });
});
