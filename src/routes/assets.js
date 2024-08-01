import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

export const createAssetsRouter = ({ route, videoStudyModel, videoAdModel }) => {
	route.post('/', async (c) => {
		const file = await c.req.formData();
		const video = file.get('video');
		const duration = file.get('duration');

		if (!video)
			return c.json({ error: 'No video file provided' }, 400);

		const uploadsDir = path.join(process.env.UPLOADS_DIR);
		if (!fs.existsSync(uploadsDir))
			fs.mkdirSync(uploadsDir);

		const videoPath = path.join(uploadsDir, video.name);
		const writeStream = fs.createWriteStream(videoPath);
		await promisify(pipeline)(video.stream(), writeStream);
		const videoStudy = {};
		videoStudy.StudyCode = video.name.split('.')[0];
		videoStudy.VideoName = video.name;
		videoStudy.Duration = duration;
		videoStudy.Link = `${process.env.UPLOADS_PATH}/${video.name}`;
		const res = await videoStudyModel.create({ i: videoStudy, c });
		if (!res.done)
			return c.json({ error: 'unprocessable asset', message: res.error }, 422);
		return c.json({ message: 'Video uploaded successfully!' });
	});

	route.get('/:id', async (c) => {
	});
};
