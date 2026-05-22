import { Router } from "express";
import { authController } from "./controller";
import { authenticate } from "@/middlewares/authenticate";

const router: Router = Router();

router.post('/oauth-callback', authController.oauthCallback);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);

export default router;