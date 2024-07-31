import { VideoStudyController } from '../controllers/videostudies.js';

export const createVideoStudyRouter = ({ route, model }) => {
	const controller = new VideoStudyController({ model });

	route.get('/', controller.getAll);
	route.post('/', controller.create);

	route.get('/:id', controller.getById);
	route.delete('/:id', controller.delete);
	route.patch('/:id', controller.update);
};
