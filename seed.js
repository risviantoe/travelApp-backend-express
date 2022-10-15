var seeder = require('mongoose-seed');
var mongoose = require('mongoose');

// Connect to MongoDB via Mongoose
seeder.connect(
	'mongodb://127.0.0.1:27017/db_staycation',
	function () {
		// Load Mongoose models
		seeder.loadModels([
			'./models/Users',
		]);
	}
);

var data = [
	{
		model: 'Users',
		documents: [
			{
				_id: mongoose.Types.ObjectId('5e96cbe292b97300fc903345'),
				username: 'admin',
				password: 'rahasia',
			},
			{
				_id: mongoose.Types.ObjectId('5e96cbe292b97300fc903346'),
				username: 'superadmin',
				password: 'rahasia',
				// role: 'admin',
			},
		],
	},
];
