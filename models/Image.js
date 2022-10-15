const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const imageSchema = new Schema({
	imageUrl: {
		type: String,
		required: true,
	},
	itemId: {
		type: ObjectId,
		ref: 'Item',
	},
});

module.exports = model('Image', imageSchema);
