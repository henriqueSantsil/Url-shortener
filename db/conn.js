const Sequelize = require('sequelize');
const sequelize = new Sequelize('encurtador', 'root', 'sucesso', {
    host: 'localhost',
    dialect: 'mysql'
});

try {
    sequelize.authenticate()
    console.log('conectado ao banco')
} catch (error) {
    console.log('não foi possivel conectar ao banco', error)
}
module.exports = sequelize;




