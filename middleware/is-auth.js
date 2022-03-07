exports.authUserPages = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.render("auth/login", {
      accessUserPages: "You need to login for access",
    });
  }

  next();
};
