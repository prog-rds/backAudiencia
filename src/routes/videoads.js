import { VideoAdController } from '../controllers/videoads.js';

export const createVideoAdRouter = ({ route, model }) => {
	const controller = new VideoAdController({ model });

	route.get('/', controller.getAll);
	route.post('/', controller.create);

	route.get('/:id', controller.getById);
	route.delete('/:id', controller.delete);
	route.patch('/:id', controller.update);
};
