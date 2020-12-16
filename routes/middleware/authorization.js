const auth = require('basic-auth');
const User = require('../../models').User;
const bcrypt = require('bcryptjs');

module.exports = async (req, res, next) => {
	const user = auth(req);

	if (user) {
		const userDB = await User.findOne({ where: { emailAddress: user.name } });

		if (userDB) {
			// compare that the incoming request password matches the stored password
			const authenticated = bcrypt.compareSync(user.pass, userDB.password);
			if (authenticated) {
				console.log(`Authentication successful for username: ${userDB.emailAddress}`);

				// Store the user on the Request object.
				req.currentUser = userDB;
				next();
				return;
			}
		}
	}

	res.status(401).json('Access Denied');
};
