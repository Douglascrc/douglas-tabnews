import database from "infra/database.js";
import { ValidationError, NotFoundError } from "infra/errors.js";
import password from "./password.js";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);
  await hashPassword(userInputValues);

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `
     INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING *`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return result.rows[0];
  }
  const newUser = await runInsertQuery(userInputValues);
  return newUser;
}

async function hashPassword(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

async function validateUniqueEmail(email) {
  const result = await database.query({
    text: `
      SELECT email
      FROM users
      WHERE LOWER(email) = LOWER($1) `,
    values: [email],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado!",
      action: "Verifique o email digitado!",
    });
  }
}

async function validateUniqueUsername(username) {
  const result = await database.query({
    text: `
      SELECT username
      FROM users
      WHERE LOWER(username) = LOWER($1) `,
    values: [username],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O username informado já está sendo utilizado!",
      action: "Verifique o username digitado!",
    });
  }
}

async function findOneByUsername(username) {
  const result = await database.query({
    text: `
    SELECT *
    FROM users
    WHERE LOWER(username) = LOWER($1)
    LIMIT 1;`,
    values: [username],
  });

  if (result.rowCount === 0) {
    throw new NotFoundError({
      message: "O username não foi encontrado no sistema.",
      action: "Verifique se o username está digitado corretamente.",
    });
  }
  return result.rows[0];
}

const user = {
  create,
  findOneByUsername,
};

export default user;
