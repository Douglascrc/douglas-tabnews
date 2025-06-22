import { NotFoundError, UnauthorizedError } from "infra/errors.js";
import user from "models/user.js";
import password from "models/password.js";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique os dados enviados.",
      });
    }
    throw error;
  }
}

async function findUserByEmail(providedEmail) {
  let storedUser;

  try {
    storedUser = await user.findOneByEmail(providedEmail);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError({
        message: "Email não confere.",
        action: "Verifique se o email enviado está correto.",
      });
    }
    throw error;
  }
  return storedUser;
}

async function validatePassword(providedPassword, storedPassword) {
  const passwordMatch = await password.compare(
    providedPassword,
    storedPassword,
  );

  if (!passwordMatch) {
    throw new UnauthorizedError({
      message: "Senha não confere.",
      action: "Verifique se a senha está correta.",
    });
  }

  return passwordMatch;
}
const authentication = {
  getAuthenticatedUser,
};

export default authentication;
