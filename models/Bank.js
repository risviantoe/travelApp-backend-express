const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bankSchema = new Schema({
	bankName: {
		type: String,
		required: true,
	},
	accountNumber: {
		type: Number,
		required: true,
	},
	accountHolder: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
});

module.exports = model('Bank', bankSchema);
