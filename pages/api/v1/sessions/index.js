import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";
import { UnauthorizedError } from "infra/errors.js";
import password from "models/password.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputValues = request.body;

  try {
    const storedUser = await user.findOneByEmail(userInputValues.email);

    const validPassword = await password.compare(
      userInputValues.password,
      storedUser.password,
    );

    if (!validPassword) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem",
        action: "Verifique os dados enviados",
      });
    }
    return response.status(201).json();
  } catch (error) {
    throw new UnauthorizedError({
      message: "Dados de autenticação não conferem",
      action: "Verifique os dados enviados",
    });
  }
}
