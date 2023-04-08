var express = require('express');
var router = express.Router();
var dbCon = require('../lib/db');
var flash = require('express-flash');
const session = require('express-session');

router.get('/', function(req, res, next)    {
    
    dbCon.query('Select * from credentials order by id desc', function(err, rows) {
        if(err) {
            req.flash('error', err);
            res.render('credentials/index', {data: ''});
        }   else    {
            res.render('credentials/index', {data: rows});
        }

    });
});

router.get('/add', function(req, res, next) {
    res.render('credentials/add', {
        website: '',
        service: '',
        username: '',
        password: '',
        description: ''
    });
});

router.post('/add', function(req, res, next) {

    let {website, service, username, password, description} = req.body;
    let errors = false;
    if(website == '' || service == '' || username == '')    {
        let errors = true;
        req.flash('error', 'Please insert all required columns');

        res.render('credentials/add',{
            website: website,
            service: service,
            username: username,
            password: password,
            description: description
        });
    }

    if(!errors) {
        let data = {
            website: website,
            service: service,
            username: username,
            password: password,
            description: description
        }
        
        dbCon.query('insert into credentials set ?', data, function(err, result)   {
            if(!err)    {
                req.flash('success', 'Credentials saved successfully');
                res.redirect('/credentials/');
            }   else    {
                res.render('credentials/add',data);
                req.flash('error', 'Saving failed');
            }
        });
    }

});
module.exports = router;