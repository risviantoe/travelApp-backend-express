const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const memberSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: String,
		required: true,
	},
});

module.exports = model('Member', memberSchema);
