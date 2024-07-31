import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

export const createAssetsRouter = ({ route }) => {
	route.post('/', async (c) => {
		const file = await c.req.formData();
		const video = file.get('video');

		if (!video)
			return c.json({ error: 'No video file provided' }, 400);

		const uploadsDir = path.join(process.env.UPLOADS_DIR);
		if (!fs.existsSync(uploadsDir))
			fs.mkdirSync(uploadsDir);

		const videoPath = path.join(uploadsDir, video.name);
		const writeStream = fs.createWriteStream(videoPath);
		await promisify(pipeline)(video.stream(), writeStream);

		return c.json({ message: 'Video uploaded successfully!' });
	});

	route.get('/:id', async (c) => {
	});
};
