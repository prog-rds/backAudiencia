import { AdController } from '../controllers/ads.js';

export const createAdRouter = ({ route, model }) => {
	const controller = new AdController({ model });

	route.get('/', controller.getAll);
	route.post('/', controller.create);

	route.get('/:id', controller.getById);
	route.delete('/:id', controller.delete);
	route.patch('/:id', controller.update);
};
