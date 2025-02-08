
module.exports =(sequelize,Sequelize)=>{
  const Societe = sequelize.define("societes",{
    siret: {
      type: Sequelize.BIGINT,
      primaryKey: true
    },
    siren: {
      type: Sequelize.BIGINT
    },
    nom_soc: {
      type: Sequelize.STRING
    },
    nom_responsable_soc: {
      type: Sequelize.STRING
    },
    date_creation_soc: {
      type: Sequelize.DATE
    },
    activite_soc:{
      type:Sequelize.STRING
    },
    libelle_naf: {
      type: Sequelize.STRING
    },
    adresse_local: {
      type: Sequelize.STRING
    },
    pays: {
      type: Sequelize.STRING
    },
    ville_soc: {
      type: Sequelize.STRING
    },
    code_postal: {
      type: Sequelize.INTEGER
    },
    syndicat: {
      type: Sequelize.STRING
    },
    observation: {
      type: Sequelize.STRING
    },
    tel: {
      type: Sequelize.STRING
    },
    app_sofitech: {
      type: Sequelize.BOOLEAN
    },
    app_cemeca: {
      type: Sequelize.BOOLEAN
    },
    soc_sofitech: {
      type: Sequelize.BOOLEAN
    },
    soc_cemeca: {
      type: Sequelize.BOOLEAN
    },
    origineprospect:{
      type:Sequelize.STRING
    }
  });
  return Societe;
};
