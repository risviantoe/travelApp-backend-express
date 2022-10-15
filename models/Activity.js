const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const activitySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	isPopular: {
		type: Boolean,
		default: false,
	},
	itemId: {
		type: ObjectId,
		ref: 'Item'
	}
});

module.exports = model('Activity', activitySchema);
