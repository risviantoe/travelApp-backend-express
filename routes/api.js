const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { uploadSingle, uploadMultiple } = require('../middlewares/multer');

router.get('/landingpage', apiController.landingPage)
router.get('/detail/:id', apiController.detailPage)
router.post('/booking', uploadSingle, apiController.bookingPage)

module.exports = router;