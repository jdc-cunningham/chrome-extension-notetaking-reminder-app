require('dotenv').config();

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

// connect to mysql, assumes above works eg. mysql is running/credentials exist
connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

// check if database exists, if not create it
connection.query('CREATE DATABASE IF NOT EXISTS `ce_note_taking_iframe`', (error, results, fields) => {
    if (error) {
        console.log('error checking if ce_note_taking_iframe database exists:', error.sqlMessage);
        return;
    }
});

// use the database
connection.query('USE ce_note_taking_iframe', (error, results, fields) => {
    if (error) {
        console.log('an error occurred trying to use the ce_note_taking_iframe database', error);
        return;
    }
});

// build the various tables and their schemas, stole these straight out of phpmyadmin ha
// users
connection.query(
    'CREATE TABLE `users` (' +
        '`id` int(11) NOT NULL AUTO_INCREMENT,' +
        '`username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,' +
        '`password_hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL,' +
        '`created_at` datetime NOT NULL,' +
        '`last_login` datetime NOT NULL,' +
        'PRIMARY KEY (`id`)' +
       ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',
    (error, results, fields) => {
        if (error) {
            console.log('error creating table users:', error.sqlMessage);
            return;
        }
    }
)

// addresses -- will get modified to include user_id so know which account made what entries
connection.query(
    'CREATE TABLE `shortcodes` (' +
        '`id` int(11) NOT NULL AUTO_INCREMENT,' +
        '`username` varchar(255) NOT NULL,' +
        '`shortcode` varchar(6) NOT NULL,' +
        '`created_at` int(11) NOT NULL,' +
        '`expires_at` int(11) NOT NULL,' +
        'PRIMARY KEY (`id`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',
    (error, results, fields) => {
        if (error) {
            console.log('error creating table addresses:', error.sqlMessage);
            return;
        }
    }
)

connection.end();