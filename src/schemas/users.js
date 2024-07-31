import z from 'zod';

const userSchema = z.object({
	UserName: z.string().min(2, {
		message: 'Name must be at least 2 characters long'
	}),
	Pass: z.string().min(8, {
		message: 'Password must be at least 8 characters long'
	}),
	UserRole: z.enum(['SuperAdmin', 'Administrador', 'Usuario']).default('Usuario'),
	Document: z.string().min(6, {
		message: 'Document must be at least 6 characters long'
	}),
	UserState: z.enum(['Activo', 'Inactivo']).default('Activo'),
	// optional fields
	avatar: z.string().url({
		message: 'Avatar must be a valid URL'
	}).optional(),
	createdAt: z.date().optional()

});

export function validateUser (input) {
	return userSchema.safeParse(input);
}

export function validatePartialUser (input) {
	return userSchema.partial().safeParse(input);
}
