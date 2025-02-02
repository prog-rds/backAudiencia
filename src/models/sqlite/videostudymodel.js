import dbManager from './dbManager.js';

export class VideoStudyModel {
	constructor () {
		this.db = dbManager.getConnection();
		console.log('->D1 VideoStudyModel');
	};

	async getAll () {
		try {
			const results = this.db.prepare('SELECT * FROM VideoStudies').all();
			return { done: true, results };
		} catch (error) {
			return { done: false, error };
		}
	}

	async getById ({ id }) {
		try {
			const results = this.db.prepare('SELECT * FROM VideoStudies WHERE StudyCode = ?').get(id);
			if (results.length === 0)
				return { done: false, error: 'VideoStudy not found' };
			return { done: true, results };
		} catch (error) {
			return { done: false, error };
		}
	}

	async create ({ i }) {
		try {
			const keys = Object.keys(i).join(', ');
			const values = Object.keys(i).map(_ => '?').join(', ');
			const query = this.db.prepare(`INSERT INTO VideoStudies (${keys}) VALUES (${values})`);
			const result = query.run(...Object.values(i));
			return { done: true, results: result };
		} catch (error) {
			return { done: false, error };
		}
	}

	async delete ({ id }) {
		try {
			console.log('LLEGA id: ', id);
			const query = this.db.prepare('DELETE FROM VideoStudies WHERE StudyCode = ?');
			const result = query.run(id);
			return result.changes > 0;
		} catch (error) {
			console.log('error: ', error);
			return false;
		}
	}

	async update ({ id, i }) {
		try {
			const sets = Object.keys(i).map(k => `${k} = ?`).join(', ');
			const query = this.db.prepare(`UPDATE VideoStudies SET ${sets} WHERE StudyCode = ?`);
			const result = await query.bind(...Object.values(i), id).run();
			return { done: true, results: result.meta.changes > 0 };
		} catch (error) {
			console.log('error: ', error);
			return { done: false, error };
		}
	}
}
