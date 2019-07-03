require('dotenv').config();
const express = require('express');
const axios = require('axios'); 
const ejsLayouts = require('express-ejs-layouts');
// Module allows use of sessions
const session = require('express-session');
// Imports passport locl strategy
const passport = require('./config/passportConfig');
// module for flash messages
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
const helmet = require('helmet');
const async = require('async');

// This is only used by the session store
const db = require('./models');

const app = express();

// This line makes the session use sequelize to write session data to a postgres table
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  experation: 1000 * 60 * 30
});

const headers = {
  'Accept': 'application/json',
  'user-key': process.env.API_KEY
};

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(ejsLayouts);
app.use(helmet());

// Configures express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

// Use this line once to set up the store table
sessionStore.sync();

// Starts the flash middleware
app.use(flash());

// Link passport to the express session
// MUST BE BELOW SESSION
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  // Use request to call the API
  axios.get('https://api-v3.igdb.com/games/', {headers}).then( function(apiResponse) {
    var games = apiResponse.data;
    let gamesRequests = games.map(function(game) {
      return function(cb) {
        axios.get('https://api-v3.igdb.com/games/' + game.id + "?fields=*", {headers}).then(function(results) {
          let gameData = results.data;
          cb(null, gameData)
        })
      }
    })

    async.parallel(gamesRequests, function(err, results) {
      //res.json(results);
    })
    //res.json({games});
    res.render('index', { games });
  });
});

app.get('/games', function(req, res) {
  axios.get('https://api-v3.igdb.com/games/?search=' + req.query.game + '&fields=name,url,cover', {headers})
  .then(function(result) {
    //res.json(result.data);
    res.render('game', {games: result.data});
  });
});

app.get('/games/:id', function(req, res) {
  axios.get('https://api-v3.igdb.com/games/' + req.params.id + '?fields=summary', {headers})
  .then(function(result) {
    //res.render('details', {games: result.data})
    res.json(result.data)
  })
})


app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
