import { Router } from 'express';
import handleRoutes from './ui/handle-routes';
import cookieHandler from './api/cookie-handler';
import leaguesList from './api/leagues-handler';
import cookieRefresh from '../middleware/cookie-refresh';
import createResources from '../middleware/create-resources';
import apiRoute from './api/api-routes';
import graphqlRoute from './graphql';

const router = Router();

// Middlewares
router.use(cookieRefresh);

// Routes
router.use('/graphql', createResources, graphqlRoute);
router.use('/api', apiRoute);

router.get('/cookie/leagues-list', leaguesList);
router.post('/cookie/columns', cookieHandler);

router.use('/', createResources, handleRoutes);

export default router;
