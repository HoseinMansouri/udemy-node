const bcrypt = require ('bcryptjs');
const User = require ('../models/user');

exports.getLogin = (req, res, next) => {
  res.render ('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res) => {
  res.render ('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign up',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById ('5ece491d5f58bd67f8c1638e')
    .then (user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save (err => {
        if (err) console.log (err);
        res.redirect ('/');
      });
    })
    .catch (err => console.log (err));
};

exports.postSignup = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  User.findOne ({email: email})
    .then (userDoc => {
      if (userDoc) {
        return res.redirect ('/signup');
      }
      return bcrypt
        .hash (password, 12)
        .then (hashpassword => {
          const user = new User ({
            email: email,
            password: hashpassword,
            cart: {items: []},
          });
          return user.save ();
        })
        .then (result => {
          res.redirect ('/login');
        });
    })
    .catch (err => console.log (err));
};

exports.postLogout = (req, res) => {
  req.session.destroy (err => {
    if (err) console.log (err);
    res.redirect ('/');
  });
};
