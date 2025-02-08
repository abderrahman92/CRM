const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const test = require("../controllers/societe.controllers");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/historique", controller.Post_historique_auth);
  app.get("/api/auth/list_historique", controller.get_historique_auth);
  app.delete("/api/auth/list_historique", controller.deleteAll_historique_auth);
  app.delete("/api/auth/list_historique/:id", controller.delete_historique_auth);
  app.post("/api/auth/signin/2fa",controller.twoFactorAuth)
  app.get("/api/find", test.findAll);
  app.post(
    "/api/auth/change-password",
    controller.changePassword
  );
  app.get("/api/auth/days-since-password-change/:userId", controller.getDaysSincePasswordChange);
  // Route to send a password reset email
  app.post("/api/auth/reset-password", controller.resetPassword);

  // Route to handle password change
  app.post("/api/auth/modifier-password", controller.modifierPassword);

    // Suppression d'un utilisateur par ID
    app.delete("/api/auth/user_delete/:id", controller.deleteUser);

    // Modification d'un utilisateur par ID
    app.put('/api/auth/update_user/:id', controller.updateUser);

};
