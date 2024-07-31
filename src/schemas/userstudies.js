import z from 'zod';
// UserId TEXT,
// StudyCode TEXT,
// StudyDate TEXT,
// StudyTime TEXT,
const schema = z.object({
	UserId: z.string().min(2, {
		message: 'UserId must be at least 2 characters long'
	}),
	StudyCode: z.string().min(2, {
		message: 'UserId must be at least 2 characters long'
	}),
	StudyDate: z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/),
	StudyTime: z.string().regex(/^\d{2}:\d{2}$/),
	createdAt: z.date().optional()
});

export function validateUserStudy (input) {
	return schema.safeParse(input);
}

export function validatePartialUserStudy (input) {
	return schema.partial().safeParse(input);
}
