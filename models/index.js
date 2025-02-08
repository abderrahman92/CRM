const config = require("../config/config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: 0,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.queryInterface = sequelize.getQueryInterface(); 
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.historique_auth = require("../models/historique_auth.js")(sequelize, Sequelize);
db.interlocuteur = require("../models/interlocuteur.model.js")(sequelize, Sequelize);
db.contrat = require("../models/contrat.model.js")(sequelize, Sequelize);
db.police = require("../models/police.model.js")(sequelize, Sequelize);
db.societe = require("../models/societe.model.js")(sequelize, Sequelize);
db.societe_sof = require("../models/societeSOF.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.action = require("../models/action.model.js")(sequelize, Sequelize);
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});



//user => interlocuteur 
db.user.hasMany(db.interlocuteur ,{ foreignKey :'id_utili' ,sourceKey : 'id'})

// user => societe
db.user.hasMany(db.societe,{foreignKey : 'id_utili' , sourceKey:'id'})

//user => action,
db.user.hasMany(db.action, {foreignKey: 'id_utili', sourceKey: 'id'});

// role => societes
db.role.hasMany(db.societe, {foreignKey: 'id_role', sourceKey: 'id'});

// user plusieurs interlocuteur
db.societe.hasMany(db.interlocuteur, {foreignKey: 'id_soc', sourceKey: 'siret'});

//societe plusieurs police
db.societe.hasMany(db.police, {foreignKey: 'id_soc', sourceKey: 'siret'});

//societe plusieurs contrat
db.societe.hasMany(db.contrat, {foreignKey: 'id_soc', sourceKey: 'siret'});

db.ROLES = ["1", "2", "3","4","5","6","7","8"];

module.exports = db;
