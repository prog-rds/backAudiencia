import * as crypto from 'node:crypto';

const checkAuth = async (_document, _password, userController, c) => {
	const users = await userController.getAllRaw(c);
	const user = users?.find(user => user.Document === _document);
	if (!user)
		return { exist: false };

	const hash = crypto.pbkdf2Sync(_password + process.env.OFPEPE, user.Salt, 100000, 64, 'sha512').toString('hex');
	if (hash !== user.Pass)
		return { exist: false };
	console.log('#> EXIST! ');

	return {
		exist: true,
		user: { _id: user.UserId, document: user.Document, role: user.UserRole, name: user.UserName }
	};
};

const handleLogin = async ({ c, userController }) => {
	const { document, password } = c.req.query();
	if (!document || !password)
		return c.json({ message: 'Please provide document and password' }, 400);
	const { exist, user, profiles } = await checkAuth(document.toLowerCase(), password, userController, c);
	if (!exist)
		return c.json({ message: 'Invalid credentials' }, 401);
	return c.json({ message: 'You are loged', token: `${process.env.TOKEN}`, user, profiles }, 200);
};

export { handleLogin };
