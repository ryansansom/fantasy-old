import { Router } from 'express';
import handleRoutes from './ui/handle-routes';
import cookieHandler from './api/cookie-handler';
import leaguesList from './api/leagues-handler';
import cookieRefresh from '../middleware/cookie-refresh';
import apiRoute from './api/api-routes';
const router = Router();

// Middlewares
router.use(cookieRefresh);

// Routes
router.use('/api', apiRoute);

router.get('/cookie/leagues-list', leaguesList);
router.post('/cookie/columns', cookieHandler);

router.use('/', handleRoutes);

export default router;
