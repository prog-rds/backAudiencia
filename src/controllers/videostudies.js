import { validateVideoStudy, validatePartialVideoStudy } from '../schemas/videostudies.js';

export class VideoStudyController {
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
		let result = validateVideoStudy(body);
		if (!result.success)
			return c.json({ error: 'unprocessable', message: JSON.parse(result.error.message) }, 422);
		result = result.data;
		const results = await this.model.create({ i: result, c });
		return c.json({ id: result.StudyCode, ...results }, 201);
	};

	delete = async (c) => {
		const { id } = c.req.param();
		const result = await this.model.delete({ id, c });
		return c.json({ message: result ? 'VideoStudy deleted' : 'VideoStudy not found' }, result ? 200 : 404);
	};

	update = async (c) => {
		const body = await c.req.json();
		let result = validatePartialVideoStudy(body);
		if (!result.success)
			return c.json({ error: JSON.parse(result.error.message) }, 400);
		const { id } = c.req.param();
		const actualVideoStudy = await this.model.getById({ id, c });
		if (!actualVideoStudy.done)
			return c.json({ error: 'VideoStudy not found' }, 404);
		result = result.data;
		const updatedVideoStudy = await this.model.update({ id, i: result, c });

		return c.json(updatedVideoStudy);
	};
}
