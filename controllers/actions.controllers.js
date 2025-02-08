const db = require("../models");
const Action = db.action;
const Op = db.Sequelize.Op;
// Create and Save a new action
exports.create_action = (req, res) => {
  // Create a societes
  const insert = {
    date_action: req.body.date_action,
    description:req.body.description,
    date_rdv: req.body.date_rdv,
    nom_interlocuteur:req.body.nom_interlocuteur,
    nom_societe: req.body.nom_societe,
    type_action: req.body.type_action,
    id_utili: req.body.id_utili,
    besoin: req.body.besoin,
    investissement: req.body.investissement,
    montant: req.body.montant,
    credit_cop: req.body.credit_cop,
    validation: req.body.validation

   
  };
  // Save Tutorial in the database
  console.log(Action)
  Action.create(insert)
    .then(data => {
      res.send({message:'société ajouter avec succée :)',data});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};
// Retrieve all actions from the database.
exports.findAll = (req, res) => {
  Action.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
// modify Action
exports.update = (req, res) => {
  const id = req.params.id;

  Action.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Action modifier avec succes."
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};