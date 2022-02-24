exports.authUserPages = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.render("login", {
      accessUserPages: "You need to login for access",
    });
  }

  next();
};
