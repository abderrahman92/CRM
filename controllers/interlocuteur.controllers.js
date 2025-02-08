
const db = require("../models");
const Interlocuteur = db.interlocuteur;
const User = db.user;
const Op = db.Sequelize.Op;
require('dotenv').config();
const { transporter, logoUrl, createMailOptions } = require("../middleware/mailerConfig");
const sendConfirmationEmail = (recipientEmail, confirmationLink,rejectLink, nom, prenom, ccEmail) => {
  const subject = "Confirmation Sofitech";
  const htmlContent = `
  <p style="text-align: center;">
    <img src="${logoUrl}" alt="Sofitech Logo" style="max-width: 100%; height: auto;">
  </p>
    <p>Bienvenue chez Sofitech !</p>
    <p>Madame, Monsieur ${nom} ${prenom},</p>
    <p>Nous vous remercions pour nos derniers échanges, vous nous avez communiqué dans ce cadre vos coordonnées.</p>
    <p>
    En cliquant sur « accepter », vous acceptez que vos données personnelles recueillies par CMGM Sofitech soient conservées en conformité avec la
     note d’information sur le traitement des données personnelles disponible sur notre site internet (https://sofitech.pro/mentions-legales). 
</p>
<p>En cliquant sur « refuser », vous refusez que vos données personnelles soient conservées, celles-ci seront automatiquement supprimer.
    </p>
    <a href="${confirmationLink}"><button>Accepter</button></a>
    <a href="${rejectLink}"><button>Refuser</button></a>
    <p>
Espérant vous accompagner dans vos divers projets.
</p>
<p>
Au plaisir de poursuivre nos échanges.
</p>
<p>
Bien cordialement,
</p>
<p>
L’équipe SOFITECH
</p>
<p style="color:blue;">
En application de la loi « informatique et libertés » du 6 janvier 1978 modifiée, et du Règlement
Général sur la Protection des Données (RGPD 2016/679 (UE), vous disposez à tout moment d’un
droit d’accès, de rectification, de portabilité et d’effacement de vos données ou encore de limitation de
traitement. Vos données sont utilisées uniquement dans le cadre de notre activité de caution mutuelle
et ne font l’objet d’aucune vente à un tiers. Vous pouvez également, pour des motifs légitimes, vous
opposer au traitement des données vous concernant. Pour exercer l’un de ces droits ou obtenir des
informations supplémentaires, adressez-nous un courrier électronique à l’adresse suivante :
accueil@sofitech.pro
</p>
<p>
Dans le respect de la réglementation et le cadre uniquement de notre activité de cautionnement, vos
données sont susceptibles d’être partagées avec nos partenaires.
</p>
  `;
  const mailOptions = createMailOptions(recipientEmail, subject, htmlContent,ccEmail);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.send_mail_confirmation = async (req, res) => {
  const id = req.params.id;

  try {
    // Assuming you have a Sequelize model named Interlocuteu

    const interlocuteur = await Interlocuteur.findOne({
      where: {
        id_interlocuteur: id,
      }
    });

    if (!interlocuteur) {
      return res.status(404).send({ message: "Interlocuteur not found with the provided ID." });
    }
    const confirmationLink = `${process.env.HOST}/confirmation/${id}`;
    const rejectLink =  `${process.env.HOST}/reject/${id}`;
    let ccEmail = null;
    if (interlocuteur.id_utili) {
      const user = await User.findByPk(interlocuteur.id_utili);
      ccEmail = user ? user.email : null;
    }

    sendConfirmationEmail(interlocuteur.email, confirmationLink,rejectLink, interlocuteur.nom, interlocuteur.prenom,ccEmail );

    res.send({ message: "interlocuteur send succefuly " });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error retrieving Interlocuteur." });
  }
};


exports.create_action = (req, res) => {
  const insert = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    adresse: req.body.adresse,
    code_postale: req.body.code_postale,
    tel: req.body.tel,
    fonction_inter: req.body.fonction_inter,
    id_utili: req.body.id_utili,
    id_soc: req.body.id_soc,
    isConfirmed: req.body.isConfirmed || 0,
  };

  // Création de l'interlocuteur
  Interlocuteur.create(insert)
    .then(data => {
      if (req.body.email) {
        // Recherche de l'email de l'utilisateur associé
        User.findByPk(req.body.id_utili)
          .then(user => {
            const ccEmail = user ? user.email : null; // Assurez-vous que l'email existe
            const confirmationLink = `${process.env.HOST}/confirmation/${data.id_interlocuteur}`;
            const rejectLink = `${process.env.HOST}/reject/${data.id_interlocuteur}`;

            // Envoi de l'email avec CC
            sendConfirmationEmail(data.email, confirmationLink,rejectLink, data.nom, data.prenom, ccEmail);

            res.send({ message: 'Interlocuteur ajouté avec succès', data });
          })
          .catch(err => {
            console.error('Failed to retrieve user for CC: ', err);
            // Continue sans CC si l'utilisateur n'est pas trouvé
            res.send({ message: 'Interlocuteur ajouté avec succès, mais CC non envoyé.', data });
          });
      } else {
        // Si l'email de l'interlocuteur n'est pas renseigné, ne pas envoyer d'email
        res.send({ message: 'Interlocuteur ajouté avec succès sans envoi d\'email', data });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la création de l'interlocuteur.",
      });
    });
};




exports.confirmation = (req, res) => {
  const id = req.params.id;
  const interlocuteurId = parseInt(id, 10);

  if (isNaN(interlocuteurId)) {
    console.log("Erreur: L'ID fourni n'est pas un entier valide.");
    return res.status(400).json({ message: "L'ID fourni n'est pas un entier valide." });
  }

  Interlocuteur.update({ isConfirmed: 1 }, {
    where: { id_interlocuteur: interlocuteurId }
  })
  .then(num => {
    if (num === 1) {
      console.log("Mise à jour réussie");
      res.json({ success: true, message: "Confirmation réussie" });
    } else {
      console.log("Interlocuteur non trouvé avec l'ID:", interlocuteurId);
      res.status(404).json({ message: "Interlocuteur non trouvé avec l'ID fourni." });
    }
  })
  .catch(err => {
    console.error("Erreur lors de la mise à jour:", err.message);
    res.status(500).json({ message: err.message });
  });
};

exports.reject = (req, res) => {
  const id = req.params.id;
  const interlocuteurId = parseInt(id, 10);

  if (isNaN(interlocuteurId)) {
    console.log("Erreur: L'ID fourni n'est pas un entier valide.");
    return res.status(400).json({ message: "L'ID fourni n'est pas un entier valide." });
  }

  Interlocuteur.update(
    { nom:null,
      prenom :null,
      email: null, 
      tel: null ,
      isConfirmed:3,
      reminderSent:3
    },
    { 
      where: { id_interlocuteur: interlocuteurId }
    }
  ).then(num => {
    if (num === 1) {
      console.log("Mise à jour réussie");
      res.json({ success: true, message: "mise a  réussie" });
    } else {
      console.log("Interlocuteur non trouvé avec l'ID:", interlocuteurId);
      res.status(404).json({ message: "Interlocuteur non trouvé avec l'ID fourni." });
    }
  })
  .catch(err => {
    console.error("Erreur lors de la mise à jour:", err.message);
    res.status(500).json({ message: err.message });
  });
};

// trouver tous les interlocuteur 
exports.findAll = (req, res) => {
  Interlocuteur.findAll()
    .then(interlocuteurs => {
      res.send(interlocuteurs);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération des interlocuteurs depuis la base de données."
      });
    });
};




// modify Interlocuteur
exports.update = (req, res) => {
  const id = req.params.id;

  Interlocuteur.update(req.body, {
    where: { id_interlocuteur: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Interlocuteur modifier avec succes."
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





exports.archiveInterlocuteur = async (req, res) => {
  const dateActuelle = new Date();
  const dixJoursAuparavant = new Date(new Date().setDate(dateActuelle.getDate() - 10));
  const trenteJoursAuparavant = new Date(new Date().setDate(dateActuelle.getDate() - 30));

  try {
    // Recherche d'interlocuteurs à relancer
    const interlocuteursARelancer = await Interlocuteur.findAll({
      where: {
        createdAt: {
          [Op.gt]: trenteJoursAuparavant,
          [Op.lt]: dixJoursAuparavant,
        },
        isConfirmed: 0,
        reminderSent: 0,
      }
    });

    // Recherche d'interlocuteurs à supprimer
    const interlocuteursASupprimer = await Interlocuteur.findAll({
      where: {
        createdAt: {
          [Op.lt]: trenteJoursAuparavant,
        },
        isConfirmed: 0,
      }
    });

    // Envoi d'e-mails de relance
    for (const interlocuteur of interlocuteursARelancer) {
      const user = await User.findByPk(interlocuteur.id_utili);
      if (!user) {
        continue; // Skip if user not found
      }

      const confirmationLink = `${process.env.HOST}/confirmation/${interlocuteur.id}`;
      const rejectLink = `${process.env.HOST}/reject/${interlocuteur.id}`;
      const ccEmail = user.email;
      const htmlContentRelance = `
      
  <p style="text-align: center;">
    <img src="${logoUrl}" alt="Sofitech Logo" style="max-width: 100%; height: auto;">
  </p>
    <p>Bienvenue chez Sofitech !</p>
    <p>Madame, Monsieur ${interlocuteur.nom} ${interlocuteur.prenom},</p>
    <p>Nous vous remercions pour nos derniers échanges, vous nous avez communiqué dans ce cadre vos coordonnées.</p>
    <p>
    En cliquant sur « accepter », vous acceptez que vos données personnelles recueillies par CMGM Sofitech soient conservées en conformité avec la
     note d’information sur le traitement des données personnelles disponible sur notre site internet (https://sofitech.pro/mentions-legales). 
</p>
<p>En cliquant sur « refuser », vous refusez que vos données personnelles soient conservées, celles-ci seront automatiquement supprimer.
    </p>
    <a href="${confirmationLink}"><button>Accepter</button></a>
    <a href="${rejectLink}"><button>Refuser</button></a>
    <p>
Espérant vous accompagner dans vos divers projets.
</p>
<p>
Au plaisir de poursuivre nos échanges.
</p>
<p>
Bien cordialement,
</p>
<p>
L’équipe SOFITECH
</p>
<p style="color:blue;">
En application de la loi « informatique et libertés » du 6 janvier 1978 modifiée, et du Règlement
Général sur la Protection des Données (RGPD 2016/679 (UE), vous disposez à tout moment d’un
droit d’accès, de rectification, de portabilité et d’effacement de vos données ou encore de limitation de
traitement. Vos données sont utilisées uniquement dans le cadre de notre activité de caution mutuelle
et ne font l’objet d’aucune vente à un tiers. Vous pouvez également, pour des motifs légitimes, vous
opposer au traitement des données vous concernant. Pour exercer l’un de ces droits ou obtenir des
informations supplémentaires, adressez-nous un courrier électronique à l’adresse suivante :
accueil@sofitech.pro
</p>
<p>
Dans le respect de la réglementation et le cadre uniquement de notre activité de cautionnement, vos
données sont susceptibles d’être partagées avec nos partenaires.
</p>
  `;
      const mailOptions = createMailOptions(interlocuteur.email, 'Rappel de confirmation de compte', htmlContentRelance, ccEmail);
      await transporter.sendMail(mailOptions);
      await Interlocuteur.update({ reminderSent: 1 }, {
        where: {
          id_interlocuteur: interlocuteur.id_interlocuteur, // Assurez-vous que cette propriété correspond à la clé primaire de votre table
        },
      });
    }

    // Suppression des interlocuteurs et envoi d'e-mails de notification
    for (const interlocuteur of interlocuteursASupprimer) {
      const user = await User.findByPk(interlocuteur.id_utili);
      if (!user) {
        continue; // Skip if user not found
      }

      const ccEmail = user.email;
      const htmlContentSuppression = `
      <p style="text-align: center;">
        <img src="${logoUrl}" alt="Sofitech Logo" style="max-width: 100%; height: auto;">
      </p>
      <p>Madame, Monsieur ${interlocuteur.nom} ${interlocuteur.prenom}</p>
      <p>Nous n’avons pas reçu votre accord pour l’enregistrement de vos données personnelles dans notre CRM Sofitech dans les délais impartis.En conséquence, et conformément à nos politiques de protection des données et de respect de la vie privée, nous avons procédé à la suppression de toutes les informations vous concernant.</p>
      <p>Cette mesure garantit la sécurité et la confidentialité de vos données personnelles, conformément au Règlement Général sur la Protection des Données (RGPD) et à notre engagement envers la protection de la vie privée de nos utilisateurs.</p>
      <p>Si la suppression de vos données a été effectuée par erreur ou si vous souhaitez les réactiver, nous vous invitons à nous contacter directement à l'adresse accueil@sofitech.pro</p>
      <p>Nous restons à votre disposition pour toute question ou information complémentaire.</p>
      <p>Bien cordialement,</p>
      <p>L’équipe SOFITECH</p>
      <p style="color:blue;">
      En application de la loi « informatique et libertés » du 6 janvier 1978 modifiée, et du Règlement Général sur la Protection des Données (RGPD 2016/679 (UE), vous disposez à tout moment d’un droit d’accès, de rectification, de portabilité et d’effacement de vos données ou encore de limitation du traitement. Pour exercer l’un de ces droits ou obtenir des informations supplémentaires, veuillez nous contacter.
      </p>
      `; // Incluez votre contenu HTML pour la notification de suppression ici
      const mailOptions = createMailOptions(interlocuteur.email, 'Suppression de compte', htmlContentSuppression, ccEmail);
      await Interlocuteur.update(
        { nom:null,
          prenom :null,
          email: null, 
          tel: null ,
          isConfirmed:3,
          reminderSent:3
        },
        { 
          where: { id_interlocuteur: interlocuteur.id_interlocuteur } 
        }
      );
      await transporter.sendMail(mailOptions);
    }

    res.send({
      message: `Relance effectuée pour ${interlocuteursARelancer.length} interlocuteur(s). ${interlocuteursASupprimer.length} interlocuteur(s) supprimé(s) avec succès.`,
    });
  } catch (err) {
    console.error("Erreur lors de l'archivage: ", err);
    res.status(500).send({ message: err.message || "Erreur lors de l'archivage des interlocuteurs." });
  }
};

