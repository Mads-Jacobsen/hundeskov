const { options } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(passportLocalMongoose, options);

options.errorMessages = {
    MissingPasswordError: 'Indtast venligst et password',
    AttemptTooSoonError: 'Kontoen er spærret i øjeblikket, prøv igen senere',
    TooManyAttemptsError: 'Kontoen er spærret pga. for mange login forsøg',
    NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
    IncorrectPasswordError: 'Password eller brugernavn er forkert',
    IncorrectUsernameError: 'Password eller brugernavn er forkert',
    MissingUsernameError: 'Indtast venligst brugernavn',
    UserExistsError: 'Én bruger med det brugernavn eksistere allerede'
}

module.exports = mongoose.model('User', UserSchema)