module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    passwordLastChanged: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    },
    resetToken: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpires: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    },
    twoFactorAuthSecret: {
      type: Sequelize.DataTypes.JSON,
      allowNull: true,
      get() {
        const value = this.getDataValue("twoFactorAuthSecret");
        try {
          return JSON.parse(value);
        } catch (error) {
          return null;
        }
      },
      set(value) {
        if (typeof value === "object" && value !== null) {
          this.setDataValue("twoFactorAuthSecret", JSON.stringify(value));
        } else {
          this.setDataValue("twoFactorAuthSecret", null);
        }
      },
    },
    loginAttempts: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    blockedUntil: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    },
  });

  return User;
};
