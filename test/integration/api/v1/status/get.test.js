test("GET localhost:3000/api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.dependencies.database_info.database_status).toBeDefined();
  expect(typeof responseBody.dependencies.database_info.database_status).toBe(
    "string",
  );

  expect(responseBody.dependencies.database_info.max_connections).toBeDefined();
  expect(typeof responseBody.dependencies.database_info.max_connections).toBe(
    "number",
  );

  expect(
    responseBody.dependencies.database_info.used_connections,
  ).toBeDefined();
  expect(typeof responseBody.dependencies.database_info.used_connections).toBe(
    "number",
  );

  expect(responseBody.dependencies.database_info.version).toBeDefined();
  expect(typeof responseBody.dependencies.database_info.version).toBe("number");
});

test("should return database_status: 'unhealthy' ", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.database_info.database_status).toBe("unhealthy");
});
