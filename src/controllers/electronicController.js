const router = require('express').Router();
const electronicManager = require('../managers/electronicManager');
const { getErrorMessage } = require('../utils/errorHelper');



router.get('/create', (req, res) => {
    res.render('electronics/create');
});

router.post('/create', async (req, res) => {
    const electronicData = {
        ...req.body,
        owner: req.user._id,
    }

    try {
      await electronicManager.create(electronicData);
      res.redirect('/electronics')
    } catch (err) {
     res.render('electronics/create', { error: getErrorMessage(err) });
    }
});

module.exports = router;