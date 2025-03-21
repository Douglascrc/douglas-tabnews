import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitAllServices();
  await orchestrator.clearDatabase();
});

describe("Forbbiden methods /api/v1/migrations", () => {
  const blockedMethods = ["PUT", "DELETE", "PATCH", "OPTIONS"];

  test.each(blockedMethods)("Methods should be blocked", async (method) => {
    const response = await fetch(
      `${process.env.WEB_SERVER}/api/v1/migrations`,
      {
        method,
      },
    );
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
