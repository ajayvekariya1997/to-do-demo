const config = require('./config.json');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/auth', require('./routes/auth'));
app.use('/todo', require('./routes/todo'));

mysql = require('mysql');
mySqlConnection();
function mySqlConnection(cb){
	var connectionObj = {
	    host: config.DB_HOST,
	    user: config.DB_USERNAME,
	    password: config.DB_PASSWORD,
	    database: config.DB_NAME,
	    charset: 'utf8mb4'
	};
	connection = mysql.createConnection(connectionObj);
    connection.connect(function(error) {
        if (error) {
            console.log('MySQL Exception >> ', error);
            return;
        }
        console.log('Connected to MySQL.');
        if(typeof cb == 'function'){
            return cb();
        }
    });
}
connection.on('error', function(err){		// mysql error detection
    console.log('MySQL connection Exception >> ', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal){		// Connection to the MySQL server is usually
    	mySqlConnection();
    }
});

app.listen(config.PORT);
