const mongoose = require('mongoose');

const electronicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [10, 'Name should be at least 10 characters long!'],
    },
    type: {
        type: String,
        required: true,
        minLength: [2, 'Type should be at least 2 characters long!'],
    },
    damages: {
        type: String,
        required: true,
        minLength: [10, 'Damages should be at least 10 characters long!'],
    },
    image: {
        type: String,
        required: true,
        match:[/^https?:\/\//, 'Invalid URL!'],
    },
    description: {
        type: String,
        required: true,
        minLength: [10, 'Description should be between 10 and 200 characters long!'],
        maxLength: [200, 'Description should be between 10 and 200 characters long!'],
    },
    production: {
        type: Number,
        required: true,
        min: [1900, 'Production should be between 1900-2023!'],
        max: [2023, 'Production should be between 1900-2023!'],
    },
    exploitation: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 0; 
            },
            message: props => `${props.value} is not a valid price. Exploitation must be a positive number.`,
        },
    },
    price: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 0; // Ensure price is a positive number
            },
            message: props => `${props.value} is not a valid price. Price must be a positive number.`,
        },
    },
    buyingList: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
})

const Electronic = mongoose.model('Electronic',electronicSchema);

module.exports = Electronic