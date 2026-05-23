import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  const healthData = {
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  };

  res.sendSuccess(healthData, "Server is healthy", 200);
});

export default router;
