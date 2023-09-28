const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');


const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.hundeskovSchema = Joi.object({
    hundeskov: Joi.object({
        titel: Joi.string().required().escapeHTML(),
        beskrivelse: Joi.string().escapeHTML(),
        lokation: Joi.string().required().escapeHTML()
    }).required(),
    deleteImage: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(0).max(5).required(),
        anmeldelse: Joi.string().required().escapeHTML()
    }).required()
})

