import z from 'zod';
// StudyCode TEXT,
// VideoAdId INTEGER,
// AdEntryTime TEXT,
// SkipEntryTime TEXT,
// IsSecundary TEXT,
const schema = z.object({
	StudyCode: z.string().min(2, {
		message: 'StudyCode must be at least 2 characters long'
	}),
	VideoAdId: z.number().int().positive(),
	AdEntryTime: z.string().regex(/^\d{2}:\d{2}$/),
	SkipEntryTime: z.string().regex(/^\d{2}:\d{2}$/),
	IsSecundary: z.enum(['true', 'false']),
	createdAt: z.date().optional()
});

export function validateAd (input) {
	return schema.safeParse(input);
}

export function validatePartialAd (input) {
	return schema.partial().safeParse(input);
}
