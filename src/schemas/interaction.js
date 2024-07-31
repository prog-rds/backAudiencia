import z from 'zod';
// UserStudyId INTEGER,
// AdId INTEGER,
// ViewTime TEXT,
// WasSkipped TEXT,
const schema = z.object({
	UserStudyId: z.number().int().positive(),
	AdId: z.number().int().positive(),
	ViewTime: z.string().regex(/^\d{2}:\d{2}$/),
	WasSkipped: z.enum(['Omitido', 'No']).default('No'),
	createdAt: z.date().optional()
});

export function validateInteraction (input) {
	return schema.safeParse(input);
}

export function validatePartialInteraction (input) {
	return schema.partial().safeParse(input);
}
