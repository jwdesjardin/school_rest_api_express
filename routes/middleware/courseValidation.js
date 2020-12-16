module.exports = (req, res, next) => {
	const errors = [];

	if (!req.body) {
		errors.push('Please include a request body');
	} else {
		if (!req.body.title) {
			errors.push('Please include a title');
		}
		if (!req.body.description) {
			errors.push('Please include a description');
		}
	}

	// if we have collected error respond with them. else move on
	if (errors.length > 0) {
		res.status(400).json({ errors });
	} else {
		next();
	}
};
