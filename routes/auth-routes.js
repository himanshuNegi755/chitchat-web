const router = require('express').Router();
var passport = require('passport');

router.get(
  "/auth/google",
  passport.authenticate("google", {
      scope: ["profile", "email"]
  })
);
    
router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("/shops");
  }
);

router.get("/current_user", (req, res) => {
   res.send(req.user);
});

router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;