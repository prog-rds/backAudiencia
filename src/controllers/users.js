import { validateUser, validatePartialUser } from '../schemas/users.js';
import * as crypto from 'node:crypto';

export class UserController {
	constructor ({ model }) {
		this.userModel = model;
	}

	getAll = async (c) => {
		const res = await this.userModel.getAll({ c });
		console.log('__res: ', res);
		res.results = res.results.map((user) => {
			const { UserId, Document, UserName, UserRole, UserState } = user; // Destructuring
			return { UserId, Document, UserName, UserRole, UserState }; // Return a new object with desired properties
		});
		return c.json(res.done ? res.results : res.error, res.done ? 200 : 417);
	};

	getAllUnfiltered = async (c) => {
		const res = await this.userModel.getAll({ c });
		return c.json(res.done ? res.results : res.error, res.done ? 200 : 417);
	};

	getAllRaw = async (c) => {
		const res = await this.userModel.getAll({ c });
		return res.results;
	};

	getById = async (c) => {
		const { id } = c.req.param();
		const res = await this.userModel.getById({ id, c });
		console.log('res: ', res.error);
		return c.json(res.done ? res.results : res.error, res.done ? 200 : 404);
	};

	// TODO: Considerar el caso cuando el correo ya existe y si es necesario controlarlo
	create = async (c) => {
		const body = await c.req.json();
		let result = validateUser(body);
		if (!result.success)
			return c.json({ error: 'unprocessable A', message: JSON.parse(result.error.message) }, 422);
		result = result.data;
		const salt = crypto.randomBytes(16).toString('hex');
		const hash = crypto.pbkdf2Sync(result.Pass.toString() + process.env.OFPEPE, salt, 100000, 64, 'sha512').toString('hex');
		result.Document = result.Document.toLowerCase();
		result.Pass = hash;
		result.Salt = salt;
		result.UserId = crypto.randomUUID().toString();
		const resultsUser = await this.userModel.create({ i: result, c });
		if (!resultsUser.done)
			return c.json({ error: 'unprocessable B', message: resultsUser.error }, 422);
		return c.json({ id: result.UserId, ...resultsUser }, 201);
	};

	delete = async (c) => {
		const { id } = c.req.param();
		const result = await this.userModel.delete({ id, c });
		return c.json({ message: result ? 'User deleted' : 'User not found' }, result ? 200 : 404);
	};

	updatePass = async (email, pass, c) => {
		const result = await this.userModel.getByEmail({ email, c });
		if (!result.done)
			return c.json({ error: 'User not found' }, 404);
		const user = result.results[0];
		const salt = crypto.randomBytes(16).toString('hex');
		const hash = crypto.pbkdf2Sync(pass.toString() + process.env.OFPEPE, salt, 100000, 64, 'sha512').toString('hex');
		const updatedUser = await this.userModel.update({ id: user.UserId, i: { Pass: hash, Salt: salt }, c });
		return c.json(updatedUser);
	};

	update = async (c) => {
		const body = await c.req.json();
		let result = validatePartialUser(body);
		if (!result.success)
			return c.json({ error: JSON.parse(result.error.message) }, 400);
		const { id } = c.req.param();
		const actualUser = await this.userModel.getById({ id, c });
		if (!actualUser.done)
			return c.json({ error: 'User not found' }, 404);
		result = result.data;

		const updatedUser = await this.userModel.update({ id, i: result, c });

		return c.json(updatedUser);
	};
}
