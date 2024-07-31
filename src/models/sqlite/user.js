import { Database } from 'bun:sqlite';

export class UserModel {
	constructor () {
		this.db = new Database('./src/db/db.sqlite');
		console.log('->D1 UserModel');
	};

	async getAll () {
		try {
			const results = this.db.prepare('SELECT * FROM Users').all();
			return { done: true, results };
		} catch (error) {
			return { done: false, error };
		}
	}

	async getById ({ id }) {
		try {
			const results = await this.db.prepare('SELECT * FROM Users WHERE UserId = ?').bind(id).all();
			if (results.length === 0)
				return { done: false, error: 'RDS-User not found' };
			return { done: true, results };
		} catch (error) {
			return { done: false, error };
		}
	}

	async create ({ i }) {
		try {
			const keys = Object.keys(i).join(', ');
			const values = Object.keys(i).map(_ => '?').join(', ');
			const query = this.db.prepare(`INSERT INTO Users (${keys}) VALUES (${values})`);
			const result = query.run(...Object.values(i));
			return { done: true, results: result };
		} catch (error) {
			return { done: false, error };
		}
	}

	async delete ({ id }) {
		try {
			const query = this.db.prepare('DELETE FROM Users WHERE UserId = ?');
			const result = await query.bind(id).run();
			return result.meta.changes > 0;
		} catch (error) {
			return false;
		}
	}

	async update ({ id, i }) {
		try {
			const sets = Object.keys(i).map(k => `${k} = ?`).join(', ');
			const query = this.db.prepare(`UPDATE Users SET ${sets} WHERE UserId = ?`);
			const result = await query.bind(...Object.values(i), id).run();
			return { done: true, results: result.meta.changes > 0 };
		} catch (error) {
			console.log('error: ', error);
			return { done: false, error };
		}
	}
}
