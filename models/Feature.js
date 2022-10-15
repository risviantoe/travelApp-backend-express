const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const featureSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	qty: {
		type: Number,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	itemId: {
		type: ObjectId,
		ref: 'Item',
	},
});

module.exports = model('Feature', featureSchema);
