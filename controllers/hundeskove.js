const Hundeskov = require('../models/hundeskov')
const { cloudinary } = require('../cloudinary')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async(req, res) => {
    const hundeskove = await Hundeskov.find({});
    res.render('hundeskove/index', {hundeskove})
}

module.exports.renderNewForm = (req, res) => {
    res.render('hundeskove/new');
}

module.exports.createHundeskov = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.hundeskov.lokation,
        limit: 1
    }).send()
    const hundeskov = new Hundeskov(req.body.hundeskov);
    hundeskov.geometry = geoData.body.features[0].geometry
    hundeskov.billede = req.files.map(f => ({url: f.path, filename: f.filename}))
    hundeskov.author = req.user._id;
    await hundeskov.save();
    console.log(hundeskov)
    req.flash('success', 'Din hundeskov er blevet tilføjet!')
    res.redirect(`/hundeskove/${hundeskov._id}`)
}

module.exports.showHundeskov = async (req, res) => {
    const hundeskov = await Hundeskov.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
        }).populate('author')
    if(!hundeskov){
        req.flash('error', 'Ups! Det ser ud som om denne hundeskov er blevet slettet')
        return res.redirect('/hundeskove')
    }
    res.render('hundeskove/show', { hundeskov });
}

module.exports.renderEditForm = async(req, res) => {
    const hundeskov = await Hundeskov.findById(req.params.id)
    if(!hundeskov){
        req.flash('error', 'Ups! Det ser ud som om denne hundeskov er blevet slettet')
        res.redirect('/hundeskove')
    }
    res.render('hundeskove/edit', { hundeskov });
}

module.exports.updateHundeskov = async(req, res) => {
    const {id} = req.params;
    const hundeskov = await Hundeskov.findByIdAndUpdate(id, {...req.body.hundeskov})
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    hundeskov.billede.push(...imgs)
    await hundeskov.save()
    if(req.body.deleteImage) {
        for(let filename of req.body.deleteImage) {
            cloudinary.uploader.destroy(filename)
        }
        await hundeskov.updateOne({$pull: {billede: {filename: {$in: req.body.deleteImage}}}})
        console.log(hundeskov)
    }
    req.flash('success', 'Informationerne er blevet opdateret')
    res.redirect(`/hundeskove/${hundeskov._id}`)
}

module.exports.deleteHundeskov = async(req, res) => {
    const {id} = req.params;
    await Hundeskov.findByIdAndRemove(id);
    req.flash('success', 'Din hundeskov er slettet.')
    res.redirect('/hundeskove');
}