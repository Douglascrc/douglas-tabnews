import controller from "infra/controller.js";
import user from "models/user.js";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const userData = await user.findOneByUsername(username);

  const safeUserData = { ...userData };
  delete safeUserData.password;

  return response.status(200).json(safeUserData);
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userInputValues = request.body;

  const updatedUser = await user.update(username, userInputValues);
  const safeUserData = { ...updatedUser };
  delete safeUserData.password;

  return response.status(200).json(safeUserData);
}
