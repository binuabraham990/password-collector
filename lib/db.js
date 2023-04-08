var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'node_credentials_app'
});

connection.connect(function(error)  {
  //  console.log(error);
});

module.exports = connection;