import fs from 'fs';
import path, { parse } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

export const createAssetsRouter = ({ route, videoStudyModel, videoAdModel }) => {
	route.post('/', async (c) => {
		const file = await c.req.formData();
		const video = file.get('video');
		const duration = file.get('duration');
		const type = parseInt(file.get('type'));
		const models = [videoStudyModel, videoAdModel];
		const model = models[type];
		const ids = ['StudyCode'];
		if (!video)
			return c.json({ error: 'No video file provided' }, 400);

		const uploadsDir = path.join(process.env.UPLOADS_DIR);
		if (!fs.existsSync(uploadsDir))
			fs.mkdirSync(uploadsDir);

		const videoPath = path.join(uploadsDir, video.name);
		const writeStream = fs.createWriteStream(videoPath);
		await promisify(pipeline)(video.stream(), writeStream);
		const videoData = {};
		if (ids[type])
			videoData[ids[type]] = video.name.split('.')[0];
		videoData.VideoName = video.name;
		videoData.Duration = duration;
		videoData.Link = `${process.env.UPLOADS_PATH}/${video.name}`;
		try {
			console.log('videoData: ', videoData);
			const res = await model.create({ i: videoData, c });
			console.log('res: ', res);
		} catch (error) {
			console.log('error: ', error);
			return c.json({ error: 'unprocessable asset', message: error }, 422);
		}
		// if (!res.done)
		// 	return c.json({ error: 'unprocessable asset', message: res.error }, 422);
		return c.json({ message: 'Video uploaded successfully!' });
	});

	route.get('/:id', async (c) => {
	});
};
