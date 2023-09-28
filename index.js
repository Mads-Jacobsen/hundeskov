if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const Hundeskov = require('./models/hundeskov')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const hundeskovRoutes = require('./routes/hundeskove')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

const session = require('express-session')
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const dbUrl = process.env.DB_URL


/* Mongo DB connection og errorhandling */
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

/* Sæt EJS til standard */

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())


app.use(helmet())

const scriptSrcUrls = [
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://cdnjs.cloudflare.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://cdnjs.cloudflare.com/",
];
const fontSrcUrls = [
    "https://cdnjs.cloudflare.com",
    "https://api.mapbox.com/fonts/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dr32nzs3q/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'keyboard hund!'
    }
});

store.on("error", function(e) {
    console.log("Session error:", e)
})

const sessionConfig = {
    store,
    name: 'sessionhund',
    secret: 'keyboard hund!',
    resave: false,
    saveUninitialized: true,
    cookie: {
/*         secure: true, */
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

/* Passport og passport-local-mongoose setup
https://github.com/saintedlama/passport-local-mongoose#api-documentation */
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes)
app.use('/hundeskove', hundeskovRoutes)
app.use('/hundeskove/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('hjem')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Siden blev ikke fundet!', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500 } = err
    if(!err.message) err.message = 'Noget gik galt.'
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log('Kører på port 3000')
})