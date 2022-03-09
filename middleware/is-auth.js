exports.authUserPages = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.render("auth/login", {
      accessUserPages: "401.You need to login for access",
    });
  }

  next();
};
