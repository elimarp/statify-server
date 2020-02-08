import { Router } from 'express';
import artistController from './app/controllers/ArtistController';

const routes = new Router();

routes.route('/artists').get(artistController.selectAll);
routes.route('/artists/:id').get(artistController.select);

export default routes;
