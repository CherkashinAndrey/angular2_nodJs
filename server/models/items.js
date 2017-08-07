module.exports = function(sequelize, Sequelize) {
 
    var Item = sequelize.define('item', {
 
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
 
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        },

        sale: {
            type: Sequelize.ENUM('0', '5', '10', '15', '20'),
            defaultValue: '0'
        },

        price: {
            type: Sequelize.INTEGER
        },

        name: {
           type: Sequelize.STRING, 
        }
  
    });
 
    return Item;
 
}
