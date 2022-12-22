import { Router } from "express";
import { NominationController } from "../controllers/in/nomination";
import { checkJwtToken } from "../domain/server/middlewares/checkJwtToken";
import { checkRole } from "../domain/server/middlewares/checkUserRole";

const router = Router();
const nominationController = new NominationController();

router.post("/", nominationController.createNomination);
router.get(
  "/",
  [checkJwtToken, checkRole(1)],
  nominationController.getNominations
);

export default router;
