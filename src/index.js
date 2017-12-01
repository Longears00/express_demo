
import Exp from 'express';
import BodyParser from 'body-parser';
import Path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Article from '../models/article';
import expressValidator from 'express-validator';
import flash from 'connect-flash';
import session from 'express-session';
import passport  from 'passport';

const app = new Exp();

mongoose.connect('mongodb://localhost/nodekb');
const db = mongoose.connection;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(Exp.static(Path.join(__dirname, '../public')));

//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

//express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//validator middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
      var namespace = param.split('.');
      let root = namespace.shift();
      let formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }

      return {
          param: formParam,
          msg: msg,
          value: value,
        };
    },
}));

//passport config
require('../config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next)=> {
  res.locals.user = req.user || null;
  next();
});

//check connection
db.once('openUri', ()=> {
    console.log('connection mongodb');
  });

//check db
db.on('error', (err)=> {
    console.log(err);
  });

//load view engine
app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res)=> {
    let articles = Article.find({}, (err, articles)=> {
        res.render('index', {
            articles: articles,
          });
      });
  });

let articles = require('../routes/articles');
app.use('/articles', articles);

let users = require('../routes/users');
app.use('/users', users);

app.listen(3000, ()=> {console.log('server stared on port 3000');});
