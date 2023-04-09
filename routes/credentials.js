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

router.get('/show/(:id)', function(req, res, next) {

    let id = req.params.id;
    dbCon.query('Select * from credentials where id = ? limit 1', parseInt(id), function(err, rows) {
        if(!err) {
            res.render('credentials/show', {data: rows[0]});
        }

    });
});

router.get('/update/(:id)', function(req, res, next) {

    let id = req.params.id;
    dbCon.query('Select * from credentials where id = ? limit 1', parseInt(id), function(err, rows) {
        if(!err) {
            let data = {
                id: req.params.id,
                website: rows[0].website,
                service: rows[0].service,
                username: rows[0].username,
                password: rows[0].password,
                description: rows[0].description
            }

            res.render('credentials/update',data);
        }

    });

});

router.post('/update/(:id)', function(req, res, next) {
    let id = req.params.id;
    let {website, service, username, password, description} = req.body;
    let data = {
        id: req.params.id,
        website: website,
        service: service,
        username: username,
        password: password,
        description: description
    }

    let errors = false;
    if(website == '' || service == '' || username == '')    {
        let errors = true;
        req.flash('error', 'Please insert all required columns');

        res.render('credentials/update',data);
    }

    if(!errors) {
        dbCon.query('update credentials SET ? WHERE id = ?' , [data, id], function(err, result)   {
            if(!err)    {
                res.redirect('/credentials/');
            }
        });
    }
});
module.exports = router;