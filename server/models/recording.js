module.exports = function(sequelize, Sequelize) {
    const pdf_status = Object.keys(require('../app/consts/pdf_status.js'));
 
    const Recording = sequelize.define('recording', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        user_id: {
            type: Sequelize.INTEGER,
            notEmpty: true
        },
 
        title: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        duration: {
            type: Sequelize.INTEGER
        },

        link: {
            type: Sequelize.STRING
        },
 
        pdf: {
            type: Sequelize.ENUM(...pdf_status),
            defaultValue: pdf_status[0]
        },
 
        public: {
            type: Sequelize.BOOLEAN
        },

        image: {
            type: Sequelize.STRING
        },

        description: {
            type: Sequelize.TEXT
        },

        screenWidth: {
            type: Sequelize.INTEGER
        },

        screenHeight: {
            type: Sequelize.INTEGER
        },

        recordingMic: {
            type: Sequelize.BOOLEAN
        },

        recordingWeb: {
            type: Sequelize.BOOLEAN
        },

        recordingTab: {
            type: Sequelize.BOOLEAN
        },
        
        category: {
            type: Sequelize.STRING
        }
 
    });
 
    return Recording;
 
}