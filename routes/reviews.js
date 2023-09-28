const express = require('express');
/* Express routes vil gerne adskille req.params, derfor når man deler routes ud
 i flere filer skal man give den "true" for at få lov til at samle/merge req.params for både
reviews og hundeskove ellers vil man få et tom objekt
Det er ikke et problem ved hundeskov routes da der ikke er tale om et "nested" id */

const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const {reviewSchema} = require('../schemas')
const reviews = require('../controllers/reviews')
const Review = require('../models/review')
const Hundeskov = require('../models/hundeskov')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;