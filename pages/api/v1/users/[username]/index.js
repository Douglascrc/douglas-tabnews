import controller from "infra/controller.js";
import user from "models/user.js";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const username = request.query.username;
  const userData = await user.findOneByUsername(username);
  const { password, ...safeUserData } = userData;
  return response.status(200).json(safeUserData);
}
