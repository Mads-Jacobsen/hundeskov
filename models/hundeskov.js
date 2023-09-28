const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const { hundeskovSchema } = require('../schemas');

/* For at få virtuals med under objects i JSON skal denne indstilling sættes til */
const opts = { toJSON: { virtuals: true } }

const BilledeSchema = new Schema({
    url: String,
    filename: String,
})

/* I stedet for at lagre thumbsnail i mongo laves der en virtual igennem mongo som giver et thumbnail URL vha. Cloudinarys Img API */
BilledeSchema.virtual('thumbnailSmall').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})

BilledeSchema.virtual('thumbnailMed').get(function() {
    return this.url.replace('/upload', '/upload/w_500')
})


const HundeskovSchema = new Schema({
    titel: String,
    billede: [BilledeSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    beskrivelse: String,
    lokation: String,
    author:  {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

HundeskovSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/hundeskove/${this._id}">${this.titel}</a></strong>
    <p>${this.beskrivelse.substring(0, 30)}...</p>`
})

/* Mongoose middleware til at fjerne anmeldeser hvis man fjerner selve hundeskoven, bliver trigget ved "findOneAndRemove" 
https://mongoosejs.com/docs/api/model.html#Model.findByIdAndRemove() */

HundeskovSchema.post('findOneAndRemove', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Hundeskov', HundeskovSchema)