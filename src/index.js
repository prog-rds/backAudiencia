import { createUserRouter } from '../src/routes/users.js';
import { UserController } from './controllers/users.js';
import { createAssetsRouter } from './routes/assets.js';
import { corsMiddleware } from './middlewares/cors.js';
import { UserModel } from './models/sqlite/user.js';
import { handleLogin } from './helpers/Auth.js';
import { bearerAuth } from 'hono/bearer-auth';
import { Hono } from 'hono';

const app = new Hono();
const userModel = new UserModel();
const userController = new UserController({ model: userModel });

app.get('/', (c) => c.json({ healt: process.env.HEALTH, code: '001' }));
app.use('*', corsMiddleware());

app.get('/login', (c) => handleLogin({ c, userController }));
app.use('*', bearerAuth({
	verifyToken: async (token, c) => {
		return token === process.env.TOKEN;
	}
}));
createUserRouter({ route: app.route('/users'), userController });
createAssetsRouter({ route: app.route('/assets') });

export default app;
// export default {
// 	fetch: app.fetch,
// 	port: process.env.PORT,
// };
