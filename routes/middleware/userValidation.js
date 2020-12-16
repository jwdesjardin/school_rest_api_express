module.exports = (req, res, next) => {
	const errors = [];

	if (!req.body) {
		errors.push('Please include a request body');
	} else {
		if (!req.body.firstName) {
			errors.push('Please include your first name');
		}
		if (!req.body.lastName) {
			errors.push('Please include your last name');
		}
		if (!req.body.emailAddress) {
			errors.push('Please include your email address');
		}
		if (!req.body.password) {
			errors.push('Please include your password');
		}
	}

	// if we have collected error respond with them. else move on
	if (errors.length > 0) {
		res.status(400).json({ errors });
	} else {
		next();
	}
};
