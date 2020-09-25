var express = require('express');
var cors = require('cors')
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

require('./model/user');

var keys = require('./config/keys');
var cookieSession = require('cookie-session');

const corsOptions = {
  credentials: true,
  origin: true
}

require('./config/passport-setup');

var passport = require('passport');
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

//import routes
const authRoutes = require("./routes/auth-routes");

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors(corsOptions));

app.use(cookieSession({
    name: 'login',
    maxAge: 60*60*1000*24,  // 7*24* add later after completion of site
    keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

//set up routes
app.use('/api', authRoutes);

// listining for port
app.listen(PORT, function() {
    console.log(`Mento API running on port ${PORT}....`);
});