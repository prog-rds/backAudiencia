import dbManager from './dbManager.js';

export class VideoAdModel {
	constructor () {
		this.db = dbManager.getConnection();
		console.log('->D1 VideoAdModel');
	};

	async getAll () {
		try {
			const results = this.db.prepare('SELECT * FROM VideoAds').all();
			return { done: true, results };
		} catch (error) {
			return { done: false, error };
		}
	}

	async getById ({ id }) {
		try {
			const results = await this.db.prepare('SELECT * FROM VideoAds WHERE VideoAdId = ?').bind(id).all();
			if (results.length === 0)
				return { done: false, error: 'VideoAd not found' };
			return { done: true, results };
		} catch (error) {
			return { done: false, error };
		}
	}

	async create ({ i }) {
		try {
			const keys = Object.keys(i).join(', ');
			const values = Object.keys(i).map(_ => '?').join(', ');
			const query = this.db.prepare(`INSERT INTO VideoAds (${keys}) VALUES (${values})`);
			const result = query.run(...Object.values(i));
			return { done: true, results: result };
		} catch (error) {
			return { done: false, error };
		}
	}

	async delete ({ id }) {
		try {
			const query = this.db.prepare('DELETE FROM VideoAds WHERE VideoAdId = ?');
			const result = await query.bind(id).run();
			return result.meta.changes > 0;
		} catch (error) {
			return false;
		}
	}

	async update ({ id, i }) {
		try {
			const sets = Object.keys(i).map(k => `${k} = ?`).join(', ');
			const query = this.db.prepare(`UPDATE VideoAds SET ${sets} WHERE VideoAdId = ?`);
			const result = await query.bind(...Object.values(i), id).run();
			return { done: true, results: result.meta.changes > 0 };
		} catch (error) {
			console.log('error: ', error);
			return { done: false, error };
		}
	}
}
