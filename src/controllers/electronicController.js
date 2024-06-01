const router = require('express').Router();


router.get('/create', (req,res) =>{
   res.render('electronics/create');
});

module.exports = router;