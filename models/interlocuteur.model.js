module.exports =(sequelize,Sequelize)=>{
  const Interlocuteur = sequelize.define("Interlocuteur",{
    id_interlocuteur: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: Sequelize.STRING
    },
    prenom: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    sexe: {
      type: Sequelize.STRING
    },
    adresse: {
      type: Sequelize.STRING
    },
    code_postale:{
      type:Sequelize.STRING
    },
    tel: {
      type: Sequelize.STRING
    },
    fonction_inter: {
      type: Sequelize.STRING
    },
    isConfirmed: {
      type: Sequelize.INTEGER,
    },
    reminderSent: {
      type: Sequelize.INTEGER,
    },
  });
  return Interlocuteur;
};
