import { Client } from "pg";

async function query(text, params) {
  const client = new Client({
    host: "localhost",
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  await client.connect();
  const result = await client.query(text, params);
  await client.end();
  return result;
}

export default {
  query: query,
};
