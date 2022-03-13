exports.authUserPages = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.render("auth/login", {
      accessUserPages: "Login to access page",
    });
  }

  next();
};

exports.registerHide = (req, res, next) => {
  if (req.user) {
    return res.redirect("/");
  }
  next();
};
