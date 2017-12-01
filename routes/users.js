
import express from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import passport  from 'passport';
const router = express.Router();

//register form
router.get('/register', (req, res)=> {
  res.render('register');
});

router.post('/register', (req, res)=> {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('password2', 'password do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
      res.render('register', {
          errors: errors,
        });
    }else {
      let newUser = new User({
          name: name,
          email: email,
          password: password,
          username: username,
        });
      bcrypt.genSalt(10, (err, salt)=> {
          bcrypt.hash(newUser.password, salt, (err, hash)=> {
            if (err) {
              console.log(error);
            }

            newUser.password = hash;
            newUser.save((err)=> {
                req.flash('success register');
                res.redirect('/users/login');
              });
          });
        });
    }
  });

router.get('/login', (req, res)=> {
  res.render('login');
});

router.post('/login', (req, res, next)=> {
    passport.authenticate('local', { successRedirect: '/',
                                    failureRedirect: '/users/login',
                                    failureFlash: true,
                                  })(req, res, next);
  });
module.exports = router;
