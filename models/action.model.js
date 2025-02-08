
module.exports =(sequelize,Sequelize)=>{
  const Action = sequelize.define("actions",{
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    date_action: {
      type: Sequelize.DATE,
    },
    description: {
      type: Sequelize.STRING
    },
    nom_interlocuteur: {
      type: Sequelize.STRING
    },
    type_action:{
      type: Sequelize.STRING
    },
    nom_societe: {
      type: Sequelize.STRING
    },
    date_rdv: {
      type: Sequelize.DATE,
    },
    validation: {
      type: Sequelize.STRING,
    },
    besoin: {
      type: Sequelize.STRING,
    },
    investissement: {
      type: Sequelize.STRING,
    },
    montant: {
      type: Sequelize.STRING,
    },
    date_factor: {
      type: Sequelize.STRING,
    },
    date_assur: {
      type: Sequelize.STRING,
    },
    nom_assur: {
      type: Sequelize.STRING,
    },
    nom_factor: {
      type: Sequelize.STRING,
    },
    credit_cop: {
      type: Sequelize.STRING,
    }
    
  });
  return Action;
};
