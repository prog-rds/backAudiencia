import { Database } from 'bun:sqlite';

class DatabaseManager {
	constructor () {
		if (!DatabaseManager.instance) {
			this.db = new Database('./src/db/db.sqlite');
			DatabaseManager.instance = this;
		}
		return DatabaseManager.instance;
	}

	getConnection () {
		return this.db;
	}
}

const instance = new DatabaseManager();
Object.freeze(instance);

export default instance;
