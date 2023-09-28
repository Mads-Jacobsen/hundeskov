const {hundeskovSchema, reviewSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Hundeskov = require('./models/hundeskov')
const Review = require('./models/review')

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Du skal være logget ind for at gøre dette');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateHundeskov = (req, res, next) => {
    const {error} = hundeskovSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const hundeskov = await Hundeskov.findById(id)
    if(!hundeskov.author.equals(req.user._id)) {
        req.flash('error', "Du har ikke rettigheder til dette")
        return res.redirect(`/hundeskove/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)) {
        req.flash('error', "Du har ikke rettigheder til dette")
        return res.redirect(`/hundeskove/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}