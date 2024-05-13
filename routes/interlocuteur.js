const interlocuteur = require("../controllers/interlocuteur.controllers");

module.exports = function(app) {
 
  
  app.post("/api/auth/interlocuteur", interlocuteur.create_action);
  app.get("/confirmation/:id", interlocuteur.confirmation);
  app.get("/send_mail_confirmation_interlocuteur/:id", interlocuteur.send_mail_confirmation);
  app.get("/api/auth/interlocuteur", interlocuteur.findAll);
  app.put("/api/auth/interlocuteur/update/:id", interlocuteur.update);
  app.get("/api/auth/archiveInterlocuteur", interlocuteur.archiveInterlocuteur);
  
};
