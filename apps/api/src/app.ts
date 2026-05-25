import 'express-async-errors';
import express from "express";
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from '@/config';
import { responseHandler } from '@/middlewares/responseHandler';
import { errorHandler } from '@/middlewares/errorHandler';
import userRouter from '@/modules/users/route';

import healthRoutes from '@/modules/health/route';
import authRouter from '@/modules/auth/route';

const app: express.Application = express();

app.use(helmet());
app.use(cors({ origin: config.server.corsOrigin, credentials: true }));
app.use(responseHandler);

//request parsing
app.use(express.json({ limit: config.server.maxRequestSize }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use('/health', healthRoutes);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter)



app.use(errorHandler);

export default app;
