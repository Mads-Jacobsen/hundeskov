const express = require('express');
const router = express.Router();
const hundeskove = require('../controllers/hundeskove')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Hundeskov = require('../models/hundeskov')
const {isLoggedIn, isAuthor, validateReview, validateHundeskov} = require('../middleware')
const {hundeskovSchema, reviewSchema} = require('../schemas')
const {storage} = require('../cloudinary')
const multer  = require('multer')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(hundeskove.index))
    .post(isLoggedIn, upload.array('billede'), validateHundeskov, catchAsync(hundeskove.createHundeskov))

router.get('/new', isLoggedIn, hundeskove.renderNewForm)

router.route('/:id')
    .get( catchAsync(hundeskove.showHundeskov))
    .put( isLoggedIn, isAuthor, upload.array('billede'), validateHundeskov, catchAsync(hundeskove.updateHundeskov))
    .delete( isLoggedIn, isAuthor, catchAsync(hundeskove.deleteHundeskov))

router.get('/:id/edit', isLoggedIn,  isAuthor, catchAsync(hundeskove.renderEditForm))

module.exports = router;