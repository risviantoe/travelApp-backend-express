const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const itemSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	country: {
		type: String,
		default: 'Indonesia',
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	unit: {
		type: String,
		default: 'night'
	},
	sumBooking: {
		type: Number,
		default: 0
	},
	isPopular: {
		type: Boolean,
		default: false,
	},
	categoryId: {
		type: ObjectId,
		ref: 'Category',
	},
	imageId: [
		{
			type: ObjectId,
			ref: 'Image',
		},
	],
	featureId: [
		{
			type: ObjectId,
			ref: 'Feature',
		},
	],
	activityId: [
		{
			type: ObjectId,
			ref: 'Activity',
		},
	],
});

module.exports = model('Item', itemSchema);
