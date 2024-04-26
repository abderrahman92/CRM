
const db = require("../models");
const Interlocuteur = db.interlocuteur;
const Op = db.Sequelize.Op;
require('dotenv').config();
const { transporter, logoUrl, createMailOptions } = require("../middleware/mailerConfig");
const sendConfirmationEmail = (recipientEmail, confirmationLink, nom, prenom) => {
  const subject = "Confirmation Sofitech";
  const htmlContent = `
  <p style="text-align: center;">
    <img src="${logoUrl}" alt="Sofitech Logo" style="max-width: 100%; height: auto;">
  </p>
    <p>Bienvenue chez Sofitech !</p>
    <p>Madame, Monsieur ${nom} ${prenom},</p>
    <p>Nous vous remercions pour nos derniers échanges, vous nous avez communiqué dans ce cadre vos coordonnées.</p>
    <p>
En cliquant sur « j’accepte », vous acceptez que vos données personnelles recueillies par
CMGM Sofitech soient conservées en conformité avec la note d’information sur le traitement
des données personnelles de la CMGM SOFITECH disponible sur notre site internet
(https://sofitech.pro/mentions-legales).
</p>
    <a href="${confirmationLink}"><button>Accepter</button></a>
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
  const mailOptions = createMailOptions(recipientEmail, subject, htmlContent);

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
      },
    });

    if (!interlocuteur) {
      return res.status(404).send({ message: "Interlocuteur not found with the provided ID." });
    }
    const confirmationLink = `${process.env.HOST}/confirmation/${id}`;

    sendConfirmationEmail(interlocuteur.email, confirmationLink, interlocuteur.nom, interlocuteur.prenom);

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

  Interlocuteur.create(insert)
    .then(data => {
      const confirmationLink = `${process.env.HOST}/confirmation/${data.id_interlocuteur}`;

      sendConfirmationEmail(data.email, confirmationLink, data.nom, data.prenom);
      res.send({ message: 'Interlocuteur ajouté avec succès', data });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la création de l'interlocuteur.",
      });
    });
};

exports.confirmation = (req, res) => {
  const id = req.params.id;

  // Assurez-vous que id est un entier
  const interlocuteurId = parseInt(id, 10);

  if (isNaN(interlocuteurId)) {
    return res.status(400).send({ message: "L'ID fourni n'est pas un entier valide." });
  }

  // Mettez à jour l'interlocuteur en fonction de l'ID
  Interlocuteur.update({ isConfirmed: 1 }, {
    where: {
      id_interlocuteur: interlocuteurId
    }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Confirmation réussie !" });
      } else {
        res.status(404).send({ message: "Interlocuteur non trouvé avec l'ID fourni." });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
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
  const dixJoursAuparavant = new Date(dateActuelle.setDate(dateActuelle.getDate() - 10));
  const trenteJoursAuparavant = new Date(dateActuelle.setDate(dateActuelle.getDate() - 30));

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
      },
    });

    // Recherche d'interlocuteurs à supprimer
    const interlocuteursASupprimer = await Interlocuteur.findAll({
      where: {
        createdAt: {
          [Op.lt]: trenteJoursAuparavant,
        },
        isConfirmed: 0,
      },
    });

    // Envoi d'e-mails de relance
    for (const interlocuteur of interlocuteursARelancer) {
      const confirmationLink = `${process.env.HOST}/confirmation/${interlocuteur.id}`;
      const htmlContentRelance = `
      <p style="text-align: center;">
        <img src="${logoUrl}" alt="Sofitech Logo" style="max-width: 100%; height: auto;">
      </p>
      <p>Bienvenue chez Sofitech !</p>
      <p>Madame, Monsieur ${nom} ${prenom},</p>
      <p>Nous vous remercions pour nos derniers échanges, vous nous avez communiqué dans ce cadre vos coordonnées.</p>
      <p>
  En cliquant sur « j’accepte », vous acceptez que vos données personnelles recueillies par
  CMGM Sofitech soient conservées en conformité avec la note d’information sur le traitement
  des données personnelles de la CMGM SOFITECH disponible sur notre site internet
  (https://sofitech.pro/mentions-legales).
  </p>
      <a href="${confirmationLink}"><button>Accepter</button></a>
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
      `; // Incluez votre contenu HTML pour la relance ici
      const mailOptions = createMailOptions(interlocuteur.email, 'Rappel de confirmation de compte', htmlContentRelance);
      await transporter.sendMail(mailOptions);
      await Interlocuteur.update({ reminderSent: 1 }, {
        where: {
          id_interlocuteur: interlocuteur.id_interlocuteur, // Assurez-vous que cette propriété correspond à la clé primaire de votre table
        },
      });
    }


    // Suppression des interlocuteurs et envoi d'e-mails de notification
    for (const interlocuteur of interlocuteursASupprimer) {
      const htmlContentSuppression = `
        <p style="text-align: center;">
          <img src="${logoUrl}" alt="Sofitech Logo" style="max-width: 100%; height: auto;">
        </p>
        <p>Bonjour,</p>
        <p>Nous n’avons pas reçu l’acceptation de l’enregistrement de vos données personnelles dans notre CRM Sofitech dans les délais impartis. En conséquence, et conformément à nos politiques de protection des données et de respect de la vie privée, nous avons procédé à la suppression de toutes les informations vous concernant.</p>
        <p>Cette mesure garantit la sécurité et la confidentialité de vos données personnelles, conformément au Règlement Général sur la Protection des Données (RGPD) et à notre engagement envers la protection de la vie privée de nos utilisateurs.</p>
        <p>Si la suppression de vos données a été effectuée par erreur ou si vous souhaitez les réactiver, nous vous invitons à nous contacter directement à l'adresse accueil@sofitech.pro</p>
        <p>Nous restons à votre disposition pour toute question ou information complémentaire.</p>
        <p>Bien cordialement,</p>
        <p>L’équipe SOFITECH</p>
        <p style="color:blue;">
        En application de la loi « informatique et libertés » du 6 janvier 1978 modifiée, et du Règlement Général sur la Protection des Données (RGPD 2016/679 (UE), vous disposez à tout moment d’un droit d’accès, de rectification, de portabilité et d’effacement de vos données ou encore de limitation du traitement. Pour exercer l’un de ces droits ou obtenir des informations supplémentaires, veuillez nous contacter.
        </p>
        `; // Incluez votre contenu HTML pour la notification de suppression ici
      const mailOptions = createMailOptions(interlocuteur.email, 'Suppression de compte', htmlContentSuppression);
      await Interlocuteur.destroy({ where: { id_interlocuteur: interlocuteur.id_interlocuteur } });
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

