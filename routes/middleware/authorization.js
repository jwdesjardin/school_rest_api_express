const auth = require('basic-auth');
const User = require('../../models').User;
const bcrypt = require('bcryptjs');

module.exports = async (req, res, next) => {
    const user = auth(req);

    

    if (!user){
        res.status(401).send('No credentials entered');
    } else {
        console.log(user.name, user.pass);

        const userDB = await User.findOne({ where: { emailAddress: user.name } });
    
    
        if (userDB){
            const authenticated = bcrypt.compareSync(user.pass, userDB.password);
            if (authenticated) {
                 console.log(`Authentication successful for username: ${userDB.emailAddress}`);

                // Store the user on the Request object.
                req.currentUser = userDB;
                next();
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('User not found in database');
        }
    
    }
  
}