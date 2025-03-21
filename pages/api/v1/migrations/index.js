import { createRouter } from "next-connect";
import controller from "infra/controller.js";
const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const migratedMigrations = await controller.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}

async function getHandler(request, response) {
  const PendingMigrations = await controller.listPendingMigrations();
  return response.status(200).json(PendingMigrations);
}
