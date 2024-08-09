import { UserStudyController } from '../controllers/userstudies.js';

export const createUserStudyRouter = ({ route, model }) => {
	const controller = new UserStudyController({ model });

	route.get('/', controller.getAll);
	route.post('/', controller.create);
	route.delete('/privateall', controller.deleteAll);

	route.get('/:id', controller.getById);
	route.delete('/:id', controller.delete);
	route.patch('/:id', controller.update);
};
