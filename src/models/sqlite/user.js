import dbManager from './dbManager.js';

export class UserModel {
	constructor () {
		this.db = dbManager.getConnection();
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
			const results = this.db.prepare('SELECT * FROM Users WHERE UserId = ?').run(id);
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
			const result = query.run(id);
			return result.changes > 0;
		} catch (error) {
			return false;
		}
	}

	async update ({ id, i }) {
		try {
			const sets = Object.keys(i).map(k => `${k} = ?`).join(', ');
			const query = this.db.prepare(`UPDATE Users SET ${sets} WHERE UserId = ?`);
			const result = query.run(...Object.values(i), id);
			return { done: true, results: result.changes > 0 };
		} catch (error) {
			console.log('error: ', error);
			return { done: false, error };
		}
	}
}
