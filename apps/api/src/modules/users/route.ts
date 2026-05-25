import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { userController } from './controller';


const router: Router = Router();

router.get('/me', authenticate, userController.getUser);
router.patch('/me', authenticate, userController.updateUser);
router.get('/:id', authenticate, userController.getUserById);

export default router;
