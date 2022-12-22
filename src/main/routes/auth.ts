import { Router } from "express";
import { Auth } from "../controllers/in/auth";

const router = Router();
const auth = new Auth();

router.post("/", auth.login);

export default router;
