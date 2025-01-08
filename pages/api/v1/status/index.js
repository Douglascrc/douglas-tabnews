import database from "infra/database";

async function status(request, response) {
  const result = await database.query("SELECT $1::text as message", [
    "Hello world!",
  ]);
  console.log(result.rows[0].message);
  response.status(200).json({ key: "Hello, Filipe" });
}

export default status;
