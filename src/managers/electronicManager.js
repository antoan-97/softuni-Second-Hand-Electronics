const Electronic = require('../models/Electronic');

exports.create = (electronicData) => Electronic.create(electronicData);

exports.getAll = () => Electronic.find().populate('owner');

exports.getOne = (electronicsId) => Electronic.findById(electronicsId).populate('owner');

exports.buy = async (electronicId, userId) => {
    const electronic = await Electronic.findById(electronicId);

    if (!electronic) {
        throw new Error('Electronic not found');
    }

    // Check if the user has already voted
    if (electronic.buyingList.includes(userId)) {
        return;
    }

    electronic.buyingList.push(userId);
    return electronic.save();
};