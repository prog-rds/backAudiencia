import dbManager from './dbManager.js';

export class InteractionModel {
	constructor () {
		this.db = dbManager.getConnection();
		console.log('->D1 InteractionModel');
	};

	async getAll () {
		try {
			const results = this.db.prepare('SELECT * FROM Interactions').all();
			return { done: true, results };
		} catch (error) {
			return { done: false, error };
		}
	}

	async getById ({ id }) {
		try {
			const results = await this.db.prepare('SELECT * FROM Interactions WHERE InteractionId = ?').bind(id).all();
			if (results.length === 0)
				return { done: false, error: 'Interaction not found' };
			return { done: true, results };
		} catch (error) {
			return { done: false, error };
		}
	}

	async create ({ i }) {
		try {
			const keys = Object.keys(i).join(', ');
			const values = Object.keys(i).map(_ => '?').join(', ');
			const query = this.db.prepare(`INSERT INTO Interactions (${keys}) VALUES (${values})`);
			const result = query.run(...Object.values(i));
			return { done: true, results: result };
		} catch (error) {
			return { done: false, error };
		}
	}

	async delete ({ id }) {
		try {
			const query = this.db.prepare('DELETE FROM Interactions WHERE InteractionId = ?');
			const result = await query.bind(id).run();
			return result.meta.changes > 0;
		} catch (error) {
			return false;
		}
	}

	async update ({ id, i }) {
		try {
			const sets = Object.keys(i).map(k => `${k} = ?`).join(', ');
			const query = this.db.prepare(`UPDATE Interactions SET ${sets} WHERE InteractionId = ?`);
			const result = await query.bind(...Object.values(i), id).run();
			return { done: true, results: result.meta.changes > 0 };
		} catch (error) {
			console.log('error: ', error);
			return { done: false, error };
		}
	}
}
