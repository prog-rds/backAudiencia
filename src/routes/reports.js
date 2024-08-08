import fs from 'fs';
import path, { parse } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import dbManager from '@src/models/sqlite/dbManager.js';
import { stringify } from 'csv-stringify/sync';

export const createReportRouter = ({ route }) => {
	route.get('/', async (c) => {
		const db = dbManager.getConnection();
		const rows = db.prepare(`
			SELECT
				u.UserName,
				vs.VideoName,
				va.VideoName AS AdName,
				a.AdEntryTime,
				a.SkipEntryTime,
				i.ViewTime,
				i.WasSkipped
			FROM
				Users u
				INNER JOIN UserStudies us ON u.UserId = us.UserId
				INNER JOIN VideoStudies vs ON us.StudyCode = vs.StudyCode
				INNER JOIN Ads a ON us.StudyCode = a.StudyCode
				INNER JOIN VideoAds va ON a.VideoAdId = va.VideoAdId
				INNER JOIN Interactions i ON a.AdId = i.AdId;`).all();
		console.log('rows: ', rows);
		const headers = {
			UserName: 'CC Usuario',
			VideoName: 'Código Estudio',
			AdName: 'Publicidad',
			AdEntryTime: 'Inicio Publicidad',
			SkipEntryTime: 'Aparición botón omitir',
			ViewTime: 'Tiempo visualizado',
			WasSkipped: 'Fue omitido'
		};
		const csvData = stringify(rows, { header: true, columns: headers });
		c.header('Content-Type', 'text/csv');
		c.header('Content-Disposition', 'attachment; filename=report.csv');
		return c.text(csvData, {
			headers: {
				'Content-Type': 'text/csv',
				'Content-Disposition': 'attachment; filename=report.csv'
			}
		});
	});
};
