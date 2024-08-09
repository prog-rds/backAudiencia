import { validateUserStudy, validatePartialUserStudy } from '../schemas/userstudies.js';

export class UserStudyController {
	constructor ({ model }) {
		this.model = model;
	}

	getAll = async (c) => {
		const res = await this.model.getAll({ c });
		return c.json(res.done ? res.results : res.error, res.done ? 200 : 417);
	};

	getById = async (c) => {
		const { id } = c.req.param();
		const res = await this.model.getById({ id, c });
		console.log('res: ', res.error);
		return c.json(res.done ? res.results : res.error, res.done ? 200 : 404);
	};

	create = async (c) => {
		const body = await c.req.json();
		let result = validateUserStudy(body);
		if (!result.success)
			return c.json({ error: 'unprocessable', message: JSON.parse(result.error.message) }, 422);
		result = result.data;
		const results = await this.model.create({ i: result, c });
		return c.json({ id: result.UserStudyId, ...results }, 201);
	};

	delete = async (c) => {
		const { id } = c.req.param();
		const result = await this.model.delete({ id, c });
		return c.json({ message: result ? 'UserStudy deleted' : 'UserStudy not found' }, result ? 200 : 404);
	};

	deleteAll = async (c) => {
		const result = await this.model.deleteAll({ c });
		return c.json({ message: result ? 'UserStudies deleted' : 'UserStudies not found' }, result ? 200 : 404);
	};

	update = async (c) => {
		const body = await c.req.json();
		let result = validatePartialUserStudy(body);
		if (!result.success)
			return c.json({ error: JSON.parse(result.error.message) }, 400);
		const { id } = c.req.param();
		const actualUserStudy = await this.model.getById({ id, c });
		if (!actualUserStudy.done)
			return c.json({ error: 'UserStudy not found' }, 404);
		result = result.data;
		const updatedUserStudy = await this.model.update({ id, i: result, c });

		return c.json(updatedUserStudy);
	};
}
