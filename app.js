const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

app.set('view engine', 'pug');
app.set('views', './views');

const presidentRoutes = require('./routes/president');
const userRoutes = require('./routes/user');
const accountRoutes = require('./routes/account');

const errorController = require('./controllers/errors');
const sportingDirector = require('./models/sportingDirectors');
const Team = require('./models/team');
const SportingDirector = require("./models/sportingDirectors")

const session = require("express-session");
const mongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');

var store = new mongoDbStore({
  uri : "mongodb://0.0.0.0/transfer_app",
  collection:"mySessions"
})



app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000 //minisecond cinsinden bir saat, sonra serverda session inaktif olur
    },
    store: store
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (!req.session.director) {
    return next();
  }
  SportingDirector.findById(req.session.director._id)
    .then(sportingDirector=>{
      req.director = sportingDirector;
      next();
    })
    .catch(err=>{console.log(err)});
})
app.use(csurf());

app.use('/president', presidentRoutes);
app.use(userRoutes);
app.use(accountRoutes);
app.use(errorController.get404Page);



mongoose.set("strictQuery", false);
mongoose.connect("mongodb://0.0.0.0/transfer_app")
    .then(()=>{
        console.log("connected to mongodb");
        app.listen(3000);        
        }
    )
    .catch(err=>{console.log(err)});