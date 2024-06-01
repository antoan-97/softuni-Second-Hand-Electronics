const router = require('express').Router();
const electronicManager = require('../managers/electronicManager');
const { getErrorMessage } = require('../utils/errorHelper');



router.get('/', async (req, res) => {
    const electronics = await electronicManager.getAll().lean();
    res.render('electronics', { electronics })
})

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

router.get('/:electronicId/details', async (req, res) => {

    const { user } = req
    const electronicId = req.params.electronicId;

    const electronic = await electronicManager.getOne(electronicId).lean();
    const isOwner = req.user?._id == electronic.owner?._id;
    const hasBuyed = electronic.buyingList?.some((v) => v?.toString() === user?._id);

    res.render('electronics/details', { isOwner, electronic, user, hasBuyed });

});



router.get('/:electronicId/buy', async (req, res) => {
    const electronicId = req.params.electronicId;
    const userId = req.user._id;

    try {
        await electronicManager.buy(electronicId, userId);
        res.redirect(`/electronics/${electronicId}/details`);
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }
});


module.exports = router;