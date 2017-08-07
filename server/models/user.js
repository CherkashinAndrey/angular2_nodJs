module.exports = function(sequelize, Sequelize) {
 
    var User = sequelize.define('user', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
 
        password: {
            type: Sequelize.STRING,
            allowNull: true
        },
 
        last_login: {
            type: Sequelize.DATE
        },
 
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },

        googleId: {
            type: Sequelize.STRING,
            allowNull: true
        },

        googleAccessToken: {
            type: Sequelize.STRING,
            allowNull: true
        },

        role: {
            type: Sequelize.ENUM('user', 'admin'),
            defaultValue: 'user'  
        }
 
 
    });
 
    return User;
 
}