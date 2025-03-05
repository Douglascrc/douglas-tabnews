import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitAllServices();
});

describe("GET /api/v1/status", () => {
  test("Retrieving current database status", async () => {
    const response = await fetch(`${process.env.WEB_SERVER}/api/v1/status`, {
      method: "POST",
    });
    expect(response.status).toBe(405);

    const responseBody = await response.json();
    expect(responseBody.message).toBe("METHOD NOT ALLOWED");
  });
});
