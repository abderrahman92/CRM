const db = require("../models");
const Societe = db.societe;
const Op = db.Sequelize.Op;
// Create and Save a new Societes
exports.create_societe = (req, res) => {
  // Create a societes
  const societe = {
    siret: req.body.siret,
    siren: req.body.siren,
    nom_soc:req.body.nom_soc,
    nom_responsable_soc: req.body.nom_responsable_soc,
    annee_soc:req.body.annee_soc,
    date_creation_soc:req.body.date_creation_soc,
    activite_soc:req.body.activite_soc,
    libelle_naf:req.body.libelle_naf,
    ville_soc:req.body.ville_soc,
    pays:req.body.pays,
    adresse_local:req.body.adresse_local,
    code_postal:req.body.code_postal,
    syndicat:req.body.syndicat,
    observation:req.body.observation,
    tel:req.body.tel,
    app_cemeca:req.body.app_cemeca,
    app_sofitech:req.body.app_sofitech,
    soc_cemeca: req.body.soc_cemeca,
    soc_sofitech: req.body.soc_sofitech,
    id_role: req.body.id_role,
    id_utili: req.body.id_utili,
    origineprospect:req.body.origineprospect
  };
  // Save Tutorial in the database
  Societe.create(societe)
    .then(data => {
      res.send({message:'société ajouter avec succès :)',data});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};
// Retrieve all societes from the database.
exports.findAll = (req, res) => {
    Societe.findAll()
  
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
// find all cemeca from the database.
exports.findAll_cemeca = (req, res) => {
    Societe.findAll({ limit: 10, order: [['updatedAt', 'DESC']] , where: { id_role:1} })
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
// find all sofitech from the database.
exports.findAll_sofitech = (req, res) => {
    Societe.findAll({limit: 10, order: [['updatedAt', 'DESC']] , where: { id_role:2} })
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
// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Societe.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Societe with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};
// Update a societes by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Societe.update(req.body, {
    where: { siret: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Societe modifier avec succes."
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
// Delete a societe with the specified id in the request
exports.delete = (req, res) => {
  
};
