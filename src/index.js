import { createUserRouter } from '../src/routes/users.js';
import { UserModel } from './models/sqlite/user.js';
import { UserController } from './controllers/users.js';

import { createVideoStudyRouter } from '../src/routes/videostudies.js';
import { VideoStudyModel } from './models/sqlite/videostudymodel.js';

import { createVideoAdRouter } from '../src/routes/videoads.js';
import { VideoAdModel } from './models/sqlite/videoadmodel.js';

import { createUserStudyRouter } from '../src/routes/userstudies.js';
import { UserStudyModel } from './models/sqlite/userstudymodel.js';

import { createAdRouter } from '../src/routes/ads.js';
import { AdModel } from './models/sqlite/admodel.js';

import { createInteractionRouter } from '../src/routes/interactions.js';
import { InteractionModel } from './models/sqlite/interactionmodel.js';

import { createAssetsRouter } from './routes/assets.js';
import { createReportRouter } from './routes/reports.js';
import { corsMiddleware } from './middlewares/cors.js';
import { handleLogin } from './helpers/Auth.js';
import { bearerAuth } from 'hono/bearer-auth';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

const app = new Hono();
const userController = new UserController({ model: new UserModel() });

app.get('/', (c) => c.json({ healt: process.env.HEALTH, code: '001' }));
app.use('*', corsMiddleware());
app.use('*', async (c, next) => {
	console.log(c.req.method, c.req.path);
	await next();
});
app.get('/uploads/*', serveStatic({ directory: process.env.UPLOADS_DIR }));

app.get('/login', (c) => handleLogin({ c, userController }));
app.use('*', bearerAuth({
	verifyToken: async (token, _) => {
		return token === process.env.TOKEN;
	}
}));
const videoStudyModel = new VideoStudyModel();
const videoAdModel = new VideoAdModel();
createReportRouter({ route: app.route('/report') });
createAssetsRouter({ route: app.route('/assets'), videoStudyModel, videoAdModel });
createUserRouter({ route: app.route('/users'), userController });
createVideoStudyRouter({ route: app.route('/videostudies'), model: videoStudyModel });
createVideoAdRouter({ route: app.route('/videoads'), model: videoAdModel });
createAdRouter({ route: app.route('/ads'), model: new AdModel() });
createUserStudyRouter({ route: app.route('/userstudies'), model: new UserStudyModel() });
createInteractionRouter({ route: app.route('/interactions'), model: new InteractionModel() });

export default app;

// export default {
// 	fetch: app.fetch,
// 	port: process.env.PORT,
// };
