test("GET localhost:3000/api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.database_settings.max_connections).toBeDefined();
  expect(typeof responseBody.database_settings.max_connections).toBe("number");

  expect(responseBody.database_settings.used_connections).toBeDefined();
  expect(typeof responseBody.database_settings.used_connections).toBe("number");

  expect(responseBody.database_settings.version).toBeDefined();
  expect(typeof responseBody.database_settings.version).toBe("number");
});
