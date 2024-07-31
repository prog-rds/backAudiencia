import { cors } from 'hono/cors';

export const corsMiddleware = () =>
	cors({
		origin: (o) => {
			let result = 'http://localhost:5173';
			if (o.startsWith('http://localhost') || o.startsWith('https://reddesignsystems.com') || o.endsWith('.reddesignsystems.com'))
				result = o;
			return result;
		}
	});
