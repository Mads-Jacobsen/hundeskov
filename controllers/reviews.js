const Review = require('../models/review')
const Hundeskov = require('../models/hundeskov')

module.exports.createReview = async (req, res) => {
    const hundeskov = await Hundeskov.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    hundeskov.reviews.push(review);
    await review.save();
    await hundeskov.save();
    req.flash('success', 'Din anmeldelse er tilføjet!')
    res.redirect(`/hundeskove/${hundeskov._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId} = req.params;
    await Hundeskov.findByIdAndUpdate(id, {$pull: {reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Din anmeldelse er slettet.')
    res.redirect(`/hundeskove/${id}`);
}