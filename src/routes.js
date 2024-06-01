const router = require('express').Router();
const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const electronicController = require('./controllers/electronicController');



router.use(homeController);
router.use('/users',userController);
router.use('/electronics',electronicController);


module.exports = router