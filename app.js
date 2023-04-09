const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');

const mysql = require('mysql');
const connection = require('./lib/db');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(
    session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false})
);
app.use(flash());

var credRoutes = require('./routes/credentials');
app.use('/credentials', credRoutes);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Express app running on port ${port}!`));