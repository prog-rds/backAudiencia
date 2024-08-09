import dbManager from './dbManager.js';

export class UserStudyModel {
	constructor () {
		this.db = dbManager.getConnection();
		console.log('->D1 UserStudyModel');
	};

	async getAll () {
		try {
			const results = this.db.prepare('SELECT * FROM UserStudies').all();
			return { done: true, results };
		} catch (error) {
			return { done: false, error };
		}
	}

	async getById ({ id }) {
		try {
			const results = await this.db.prepare('SELECT * FROM UserStudies WHERE UserStudyId = ?').bind(id).all();
			if (results.length === 0)
				return { done: false, error: 'UserStudy not found' };
			return { done: true, results };
		} catch (error) {
			return { done: false, error };
		}
	}

	async create ({ i }) {
		try {
			const keys = Object.keys(i).join(', ');
			const values = Object.keys(i).map(_ => '?').join(', ');
			const query = this.db.prepare(`INSERT INTO UserStudies (${keys}) VALUES (${values})`);
			const result = query.run(...Object.values(i));
			const lastInsertId = this.db.lastInsertRowid;
			result.UserStudyId = lastInsertId;
			return { done: true, results: result };
		} catch (error) {
			return { done: false, error };
		}
	}

	async delete ({ id }) {
		try {
			const query = this.db.prepare('DELETE FROM UserStudies WHERE UserStudyId = ?');
			const result = query.run(id);
			return result.changes > 0;
		} catch (error) {
			return false;
		}
	}

	async deleteAll ({ c }) {
		try {
			const query = this.db.prepare('DELETE FROM UserStudies');
			const result = query.run();
			return result.changes > 0;
		} catch (error) {
			return false;
		}
	}

	async update ({ id, i }) {
		try {
			const sets = Object.keys(i).map(k => `${k} = ?`).join(', ');
			const query = this.db.prepare(`UPDATE UserStudies SET ${sets} WHERE UserStudyId = ?`);
			const result = await query.bind(...Object.values(i), id).run();
			return { done: true, results: result.meta.changes > 0 };
		} catch (error) {
			console.log('error: ', error);
			return { done: false, error };
		}
	}
}
