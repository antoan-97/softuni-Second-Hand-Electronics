const router = require('express').Router();
const electronicManager = require('../managers/electronicManager');

const { getErrorMessage } = require('../utils/errorHelper');
const { isAuth, isOwner } = require('../middlewares/authMiddleware');



router.get('/', async (req, res) => {
    const electronics = await electronicManager.getAll().lean();
    res.render('electronics', { electronics })
})

router.get('/create', isAuth, (req, res) => {
    res.render('electronics/create');
});

router.post('/create', isAuth, async (req, res) => {
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



router.get('/:electronicId/buy', isAuth, async (req, res) => {
    const electronicId = req.params.electronicId;
    const userId = req.user._id;

    try {
        await electronicManager.buy(electronicId, userId);
        res.redirect(`/electronics/${electronicId}/details`);
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }
});

router.get('/:electronicId/edit', isAuth, isOwner, async (req, res) => {
    const electronicId = req.params.electronicId;

    try {
        const electronic = await electronicManager.getOne(electronicId).lean();
        res.render('electronics/edit', { electronic });
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }
});


router.post('/:electronicId/edit', isAuth, isOwner, async (req, res) => {
    const electronicId = req.params.electronicId;
    const electronicData = req.body;

    try {
        await electronicManager.edit(electronicId, electronicData);
        res.redirect(`/electronics/${electronicId}/details`)
    } catch (err) {
        res.render('electronics/edit', { electronic: { ...electronicData, _id: electronicId }, error: getErrorMessage(err) });
    }
});


router.get('/:electronicId/delete', isAuth, isOwner, async (req, res) => {
    const electronicId = req.params.electronicId;

    try {
        await electronicManager.delete(electronicId);
        res.redirect('/electronics')
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }
});

router.get('/search', async (req, res) => {
    const { name, type } = req.query;

    let query = {};
    if (name) {
        query.name = new RegExp(`^${name}$`, 'i'); // Case-insensitive full match
    }

    if (type) {
        query.type = new RegExp(`^${type}$`, 'i'); // Case-insensitive full match
    }

    try {
        const results = await electronicManager.search(query);
        res.render('partials/search', { results }); // Render the 'search.hbs' template
    } catch (err) {
        res.render('404', { error: getErrorMessage(err) });
    }
});


module.exports = router;