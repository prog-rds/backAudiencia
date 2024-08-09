import { InteractionController } from '../controllers/interactions.js';

export const createInteractionRouter = ({ route, model }) => {
	const controller = new InteractionController({ model });

	route.get('/', controller.getAll);
	route.post('/', controller.create);
	route.delete('/privateall', controller.deleteAll);

	route.get('/:id', controller.getById);
	route.delete('/:id', controller.delete);
	route.patch('/:id', controller.update);
};
