export class UserModel {
	constructor () {
		console.log('->D1 UserModel');
	};

	async getAll ({ c }) {
		try {
			const { results } = await process.env.DB.prepare('SELECT * FROM Users').run();
			return { done: true, results };
		} catch (error) {
			return { done: false, error };
		}
	}

	async getById ({ id, c }) {
		try {
			const { results } = await process.env.DB.prepare('SELECT * FROM Users WHERE UserId = ?').bind(id).all();
			if (results.length === 0)
				return { done: false, error: 'RDS-User not found' };
			return { done: true, results };
		} catch (error) {
			return { done: false, error };
		}
	}

	async create ({ i, c }) {
		try {
			const query = await process.env.DB.prepare(
				'INSERT INTO Users (UserId, UserName, Pass, Salt, UserRole, Document, UserState) VALUES (?, ?, ?, ?, ?, ?, ?)'
			);
			const result = await query.bind(i.UserId, i.UserName, i.Pass, i.Salt, i.UserRole, i.Document, i.UserState).run();
			return { done: true, results: result.meta };
		} catch (error) {
			return { done: false, error };
		}
	}

	async delete ({ id, c }) {
		try {
			const query = await process.env.DB.prepare('DELETE FROM Users WHERE UserId = ?');
			const result = await query.bind(id).run();
			return result.meta.changes > 0;
		} catch (error) {
			return false;
		}
	}

	async update ({ id, i, c }) {
		try {
			const sets = Object.keys(i).map(k => `${k} = ?`).join(', ');
			const query = await process.env.DB.prepare(`UPDATE Users SET ${sets} WHERE UserId = ?`);
			const result = await query.bind(...Object.values(i), id).run();
			return { done: true, results: result.meta.changes > 0 };
		} catch (error) {
			console.log('error: ', error);
			return { done: false, error };
		}
	}
}
