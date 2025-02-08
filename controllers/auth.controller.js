const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Historique = db.historique_auth;
const Op = db.Sequelize.Op;
require('dotenv').config();
const HOST = process.env.HOST
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
// Import the necessary modules
const nodemailer = require("nodemailer");
exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),

  })
    .then(user => {
      if (!req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {

          user.setRoles(roles).then(() => {
            res.send({ message: " user was registered successfully!" });
          });
        });
      } else {
        // user role = checkbox
        const roles = req.body.roles;
        if (roles)
          var new_roles = [];
        for (let i = 0; i < roles.length; i++) {
          new_roles.push(roles[i]);
        }
        console.log(new_roles, 'nouveau tableau')
        user.setRoles(new_roles).then(() => {
          res.send({ message: "profile was registered successfully!" });
        });

      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifiez si l'utilisateur existe avant de le supprimer
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé." });
    }

    // Supprimez l'utilisateur
    await user.destroy();
    res.send({ message: "Utilisateur supprimé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Erreur lors de la suppression de l'utilisateur.", error: err.message });
  }
};

exports.updateUser = (req, res) => {
    const userId = req.params.id; // ID de l'utilisateur à mettre à jour
    const { username, email, roles } = req.body; // Données mises à jour

    // Vérifiez si l'utilisateur existe
    User.findByPk(userId)
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "Utilisateur non trouvé" });
        }

        // Supprimer l'utilisateur existant
        user.destroy().then(() => {
          // Créer un nouvel utilisateur avec les informations mises à jour
          User.create({
            username: username,
            email: email, // Hachage du mot de passe
          })
          .then(newUser => {
              // Vérification des rôles et leur association
          if (!req.body.roles) {
                return Role.findAll({
                  where: {
                    name: {
                      [Op.or]: roles, // Recherche des rôles par leur nom
                    },
                  },
                }).then(roles => {
                  newUser.setRoles(roles).then(() => {
                    res.send({ message: "L'utilisateur a été mis à jour et recréé avec succès!" });
                  });
                });
              } else {
                // Si des rôles sont spécifiés, les ajouter
                const new_roles = [];
                for (let i = 0; i < roles.length; i++) {
                  new_roles.push(roles[i]);
                }
                console.log(new_roles, 'nouveau tableau');
                newUser.setRoles(new_roles).then(() => {
                  res.send({ message: "Profil mis à jour avec succès!" });
                });
              }
            })
            .catch(err => {
              res.status(500).send({ message: err.message });
            });
        }).catch(err => {
          res.status(500).send({ message: "Erreur lors de la suppression de l'utilisateur." });
        });
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur lors de la recherche de l'utilisateur.",
          error: err.message,
        });
      });
  };





// Function to verify the 2FA code
function verifyTwoFactorAuthCode(user, verificationCode) {
  if (!user.twoFactorAuthSecret) {
    // No 2FA secret, cannot verify
    return false;
  }
  const twoFactorAuthSecretValue = user.twoFactorAuthSecret;
  const twoFactorAuthSecretObject = JSON.parse(twoFactorAuthSecretValue);
  const verification2FA = twoFactorAuthSecretObject.code;
  console.log(verification2FA)
  console.log()
  if (parseInt(verificationCode) !== verification2FA) {
    console.log("Code de vérification incorrect :", verificationCode);
    console.log("Code de vérification attendu :", verification2FA);
    // Incorrect code
    return false;
  }

  return true; // Code is valid
}

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      }
    });

    if (!user) {
      return res.status(404).send({ message: "Utilisateur introuvable :(" });
    }

    const daysSinceLastChange = daysSincePasswordChange(user);

    if (daysSinceLastChange >= 91) {
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      await user.update({
        password: hashedPassword,
        passwordLastChanged: new Date(),
      });

      return res.status(500).send({
        message: "Votre mot de passe a expiré. Veuillez réinitialiser votre mot de passe.",
      });
    }

    if (user.loginAttempts >= 3) {
      const currentTime = new Date();
      if (user.blockedUntil && currentTime < user.blockedUntil) {
        return res.status(401).send({
          message: "Trop de tentatives de connexion infructueuses. Réessayez plus tard.",
        });
      } else {
        await user.update({
          loginAttempts: 0,
          blockedUntil: null,
        });

        // Continue with the login attempt
        continueLogin(user, req, res);
      }
    } else {
      // Continue with the login attempt
      continueLogin(user, req, res);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
function continueLogin(user, req, res) {
  var passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  );

  if (!passwordIsValid) {
    // Mot de passe incorrect, incrémenter loginAttempts ici
    user.increment("loginAttempts"); // Incrémenter loginAttempts

    // Bloquer l'utilisateur après 3 tentatives infructueuses
    if (user.loginAttempts >= 2) {
      const blockedUntil = new Date();
      blockedUntil.setMinutes(blockedUntil.getMinutes() + 5); // Bloquer l'utilisateur pendant 5 minutes
      user.update({
        blockedUntil: blockedUntil,
      }).then(() => {
        return res.status(401).send({
          accessToken: null,
          message: "Mot de passe incorrect! Trop de tentatives, l'utilisateur est bloqué pendant 5 minutes.",
        });
      }).catch(err => {
        res.status(500).send({ message: err.message });
      });
    } else {
      return res.status(401).send({
        accessToken: null,
        message: "Mot de passe incorrect!++",
      });
    }
  } else {
     // Génération d'un code de vérification (6 chiffres)
     const verificationCode = Math.floor(100000 + Math.random() * 900000);
     const expiration = new Date();
     expiration.setTime(expiration.getTime() + 5 * 60 * 60 * 1000); // 2 heures à partir de maintenant

     // Stockage du code de vérification dans l'objet user
     user.twoFactorAuthSecret = {
       code: verificationCode,
       expires: expiration,
     };

     // Envoi du code de vérification à l'adresse e-mail de l'utilisateur
     const mailOptions = {
      from: "Sofitech <accueilcrm@sofitech.pro>",
      to: user.email,
      subject: "Code de vérification pour connexion CRM SOFITECH",
      text: `Votre code de vérification est : ${verificationCode}`,
  };

     const transporter = nodemailer.createTransport({
       host: process.env.MAIL_HOST, // Outlook SMTP server
       port: 587, // Use a non-standard port (587 is the standard TLS port)
       auth: {
         user: process.env.MAIL_USER, // Your Outlook email
         pass: process.env.MAIL_PASSWORD, // Your Outlook password
       },
     });

 // Envoi de l'e-mail avec le code de vérification
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Erreur lors de l'envoi de l'e-mail de vérification :", error);
  } else {
    console.log("E-mail de vérification envoyé à :", user.email);

    // Stocker le code de vérification dans la base de données
    user.update({
      twoFactorAuthSecret: {
        code: verificationCode,
        expires: expiration,
      },
    }).then(savedUser => {
      // Réinitialiser loginAttempts et lever le blocage si nécessaire
      savedUser.update({
        loginAttempts: 0,
        blockedUntil: null,
      }).then(() => {
        // La connexion est réussie, générer le token et renvoyer la réponse
        generateTokenAndResponse(savedUser, res); // Passer le code de vérification ici
      }).catch(err => {
        res.status(500).send({ message: err.message });
      });
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
  }
});

  }
}

function generateTokenAndResponse(user, res) {
  // Générer le token JWT
  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 7200, // 24 heures
  });

  const authorities = []; // Initialisez le tableau des autorités si nécessaire

  // Récupérer les rôles ou autres autorités liées ici
  user.getRoles().then((roles) => {
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    // Envoyer la réponse avec les données nécessaires, y compris le rôle
    res.status(200).send({
      message: "Connection établie avec succès :)",
    });
  }).catch((err) => {
    res.status(500).send({ message: err.message });
  });
}


exports.twoFactorAuth = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    const verificationCode = parseInt(req.body.verificationCode);
    const twoFactorAuthSecretValue = user.twoFactorAuthSecret.code;
     // Vérifier si l'utilisateur est bloqué pour la vérification du 2FA
     if (user.blockedUntil && user.blockedUntil > new Date()) {
      // L'utilisateur est bloqué, envoi d'une réponse avec l'heure de déblocage
      return res.status(401).send({
        message: "Vérification 2FA temporairement bloquée. Réessayez après " + user.blockedUntil,
      });
    }

    if (verificationCode === twoFactorAuthSecretValue) {
      // Récupérer les rôles de l'utilisateur
      user.getRoles().then((roles) => {
        const authorities = roles.map(role => "ROLE_" + role.name.toUpperCase());

        // Générer le jeton JWT
        const token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 7200, // 24 heures
        });

        // Envoyer la réponse avec les données nécessaires, y compris le rôle et le jeton
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          passwordLastChanged: user.passwordLastChanged,
          authorities: authorities,
          accessToken: token,
          message: "Connexion établie avec succès :)",
        });
      }).catch((err) => {
        res.status(500).send({ message: err.message });
      });
    } else {
      user.increment("loginAttempts");
      if (user.loginAttempts >= 3) {
        // Bloquer l'utilisateur pendant 5 minutes après trois tentatives infructueuses de vérification du 2FA
        user.update({
          blockedUntil: new Date(new Date().getTime() + 5 * 60 * 1000), // Bloquer pendant 5 minutes
        });
      }
      res.status(401).send({ message: "Code de vérification incorrect." });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};








// Add a new function for changing the password
exports.changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // Find the user by userId
    const user = await User.findOne({ where: { id: userId } });

    // Check if the old password is correct
    const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Incorrect old password." });
    }

    // Update the password
    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    await user.update({ password: hashedPassword, passwordLastChanged: new Date() });

    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Error changing password." });
  }
};
exports.Post_historique_auth = (req, res) => {

  // create connection user 
  const historique = {
    username: req.body.username,
    password: req.body.password,
    message: req.body.message,
    date_connection: new Date(),

  };
  // Save Tutorial in the database
  Historique.create(historique)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};
exports.get_historique_auth = (req, res) => {
  Historique.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
// Delete all historique_auth from the database.
exports.deleteAll_historique_auth = (req, res) => {
  Historique.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};
exports.delete_historique_auth = (req, res) => {
  const id = req.params.id;

  Historique.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "histrorique de hotentificatio supprimer avec succes:)!"
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe historique de connection was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};
const daysSincePasswordChange = (user) => {
  if (!user) {
    return null; // Handle cases where the user is not provided
  }

  if (!user.passwordLastChanged) {
    // If passwordLastChanged is not set, return the creation date
    const createdAtDate = new Date(user.createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - createdAtDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
  }

  const lastChangedDate = new Date(user.passwordLastChanged);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - lastChangedDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return daysDifference;
};






exports.getDaysSincePasswordChange = async (req, res) => {
  const { userId } = req.params;
  console.log("userId:", userId);
  try {
    const user = await User.findOne({ where: { id: userId } });
    console.log("user:", user);
    const daysSinceLastChange = daysSincePasswordChange(user);

    // Check if password expiration threshold has been reached
    if (daysSinceLastChange >= 30) {
      // Generate a random password of 10 characters
      const randomPassword = Math.random().toString(36).slice(-10);

      // Hash the random password
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Reset the user's password to the hashed random password
      await user.update({ password: hashedPassword });
    }

    res.status(200).json({ days: daysSinceLastChange });
  } catch (err) {
    console.error("Error fetching days since password change:", err);
    res.status(500).json({ message: "Error fetching days since password change." });
  }
};




     const transporter = nodemailer.createTransport({
       host: process.env.MAIL_HOST, // Outlook SMTP server
       port: 587, // Use a non-standard port (587 is the standard TLS port)
       auth: {
         user: process.env.MAIL_USER, // Your Outlook email
         pass: process.env.MAIL_PASSWORD, // Your Outlook password
       },
     });

// Function to generate a random password
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(2);
};

// Function to send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const mailOptions = {
      from: "accueilcrm@sofitech.pro", // Use your Outlook email
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${HOST}/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a random password reset token
    const resetToken = generateRandomPassword();

    // Store the reset token and its expiration in the user's record in the database
    await user.update({
      resetToken: resetToken,
      resetTokenExpires: new Date(Date.now() + 3600000), // Token expires in 1 hour
    });

    // Send the password reset email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.error("Error sending password reset email:", err);
    res.status(500).json({ message: "Error sending password reset email." });
  }
};

exports.modifierPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  console.log("resetToken:", resetToken);
  console.log("newPassword:", newPassword);

  try {
    // Find the user by resetToken
    const user = await User.findOne({ where: { resetToken: resetToken } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the resetToken is still valid
    if (user.resetTokenExpires < new Date()) {
      return res.status(401).json({ message: "Password reset token has expired." });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    // Update the user's password and resetToken
    await user.update({
      password: hashedPassword,
      passwordLastChanged: new Date(),
      resetToken: null,
      resetTokenExpires: null,
    });

    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Error changing password." });
  }
};