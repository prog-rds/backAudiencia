export const createUserRouter = ({ route, userController }) => {
	route.get('/', userController.getAll);
	route.get('/raw', userController.getAllUnfiltered);
	route.post('/', userController.create);
	route.post('/file', userController.createManyByFile);

	route.get('/:id', userController.getById);
	route.delete('/:id', userController.delete);
	route.patch('/:id', userController.update);
};
