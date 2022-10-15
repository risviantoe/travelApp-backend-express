const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: 'public/images',
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const uploadSingle = multer({
	storage: storage,
	limits: { fileSize: 1048576 },
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
}).single('image');

const uploadMultiple = multer({
	storage: storage,
	// limits: { fileSize: 1048576 },
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
}).array('image');

function checkFileType(file, cb) {
	const fileTypes = /jpeg|jpg|png|gif|svg/;
	const extName = fileTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimeType = fileTypes.test(file.mimetype);
	if (extName && mimeType) {
		return cb(null, true);
	} else {
		cb('Error: Image only!');
	}
}

module.exports = { uploadSingle, uploadMultiple };
