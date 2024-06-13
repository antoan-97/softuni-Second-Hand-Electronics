const jwt = require('../lib/jwt');
const { SECRET } = require('../config/config');
const electronicManager = require('../managers/electronicManager');


exports.auth = async (req,res,next) => {
    const token = req.cookies['token'];
    
    if(token){
        try {
            const decodetToken = await jwt.verify(token,SECRET);
            req.user = decodetToken;
            res.locals.user = decodetToken;
            res.locals.itsAuthenticated = true;
            next();
        } catch (err) {
            res.clearCookie('token');
            res.redirect('users/login');
        }
    }else{
        next();
    }
};


exports.isAuth = (req,res,next) =>{
    if(!req.user){
        res.redirect('/users/login');
    }
    next();
};

exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        // Redirect to 404 page  if user is already logged in
        return res.render('404');
    }
    next();
};


exports.isOwner = async (req, res, next) => {
    try {
        const electronicId = req.params.electronicId;
        const electronic = await electronicManager.getOne(electronicId);

        if (!electronic) {
            console.log(`Electronic with ID ${electronicId} not found`);
            return res.render('404');
        }

        if (!req.user) {
            console.log('User is not authenticated');
            return res.render('404');
        }

        console.log(`Electronic owner: ${String(electronic.owner._id)}`);
        console.log(`Authenticated user: ${String(req.user._id)}`);

        if (String(electronic.owner._id) === String(req.user._id)) {
            console.log(`User ${req.user._id} is the owner of electronic ${electronicId}`);
            return next();
        } else {
            console.log(`User ${req.user._id} is not the owner of electronic ${electronicId}`);
            return res.render('404');
        }
    } catch (error) {
        console.error(`Error in isOwner middleware: ${error.message}`);
        return res.render('404', { error: 'An error occurred while checking ownership' });
    }
};