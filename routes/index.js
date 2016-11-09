import { Router } from 'express';
import handleRoutes from './ui/handle-routes';
import apiRoute from './api/api-routes';
const router = Router();

router.use('/api', apiRoute);

router.use('/', handleRoutes);

export default router;
