import { Router } from 'express';
import handleRoutes from './ui/handle-routes';
import cookieHandler from './api/cookie-handler';
import apiRoute from './api/api-routes';
const router = Router();

router.use('/api', apiRoute);

router.post('/cookie/columns', cookieHandler);

router.use('/', handleRoutes);

export default router;
