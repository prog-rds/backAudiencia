import { cors } from 'hono/cors';

export const corsMiddleware = () =>
	cors({
		origin: (o) => {
			let result = 'http://localhost:5173';
			if (o.startsWith('http://localhost') || o.startsWith('https://rds-la.com') || o.endsWith('.rds-la.com'))
				result = o;
			return result;
		}
	});
