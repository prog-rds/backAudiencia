import z from 'zod';
// VideoName TEXT,
// Duration TEXT,
// Link TEXT
const schema = z.object({
	VideoName: z.string().min(2, {
		message: 'VideoName must be at least 2 characters long'
	}),
	Duration: z.string().regex(/^\d{2}:\d{2}$/),
	Link: z.string().min(2, {
		message: 'Link must be at least 2 characters long'
	}),
	createdAt: z.date().optional()

});

export function validateVideoStudy (input) {
	return schema.safeParse(input);
}

export function validatePartialVideoStudy (input) {
	return schema.partial().safeParse(input);
}
