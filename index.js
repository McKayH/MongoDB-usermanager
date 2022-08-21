const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3200;

app.use(express.urlencoded({extended: false}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
const mongoose = require('mongoose');
const { redirect } = require('express/lib/response');
const { listenerCount } = require('process');
const dbConectString = 'mongodb://localhost/usermanager';

mongoose.connect(dbConectString);
const db = mongoose.connection;

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName:  String,
    age: Number,
    email: String,
});

const users = mongoose.model('User',  userSchema);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db connected');
});

app.get('/', (req, res)=>{
    res.render('newUser')
    
});
app.post('/user', (req, res)=>{
    const newUser = new users({
        firstName: req.body.fname,
        lastName: req.body.lname,
        age: req.body.age,
        email: req.body.email,
    });
    newUser.save((err,doc)=>{
        if (!err){
                res.redirect('users');

        }else{
            console.log('Error during record insertion : ' + err);
            }
    });

});
app.get('/users', (req, res)=>{
    users.find().limit(5).then(users =>{
        res.render('users', {
            pageTitle: 'List of users',
            users: users
        });
    });
});
app.get('/delete/:id', (req, res)=>{
    users.deleteOne({_id: req.params.id }).then(function(){
        console.log("Data deleted"); // Success
        res.redirect('back')
    }).catch(function(error){
        console.log(error); // Failure
    });
    
});
app.get('/edit/:id',(req, res)=>{
    users.findById(req.params.id, (err, doc)=>{
        if (err) {
            console.log(err);
        }
        else{
            res.render('edit', {
                pageTitle: 'Edit User: ' + doc.firstName + ' ' + doc.lastName,
                user: doc,
            });
        }
    });
});
app.post('/change/:id', (req,res)=>{
    users.findByIdAndUpdate(req.params.id, {
        firstName: req.body.fname,
        lastName: req.body.lname,
        age: req.body.age,
        email: req.body.email,
    }, (err, data)=>{
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/users');
});
app.post('/searching', (req, res)=>{
    console.log(req.body.select);
    if(req.body.select === 'FirstName'){
        users.find({firstName: req.body.search}, (err, docs)=>{
            if (err){
                console.log(err);
            }
            else{
                console.log(docs);
                res.render('results', {
                    pageTitle: 'Search Results',
                    results: docs,
                });
            }
        });
    }
    else if(req.body.select === 'LastName'){
        users.find({lastName: req.body.search}, (err, docs)=>{
            if (err){
                console.log(err);
            }
            else{
                console.log(docs);
                res.render('results', {
                    pageTitle: 'Search Results',
                    results: docs,
                });
            }
        });
    }
    else{
        console.log('ERROR: did not select search params');
    }
});
app.post('/sort', (req,res)=>{
    if(req.body.sortSelect === 'sFName' && req.body.sortOrd === 'ASC') {
        users.find({}).sort('firstName').exec((err,docs)=>{
            res.render('users', {
                pageTitle: 'Ordered list Z>a',
                users: docs,
            });
        });
    }
    else if(req.body.sortSelect === 'sFName' && req.body.sortOrd === 'DSC') {
        users.find({}).sort({firstName: 'desc'}).exec((err,docs)=>{
            res.render('users', {
                pageTitle: 'Ordered list Z>a',
                users: docs,
            });
        });
    }
    else if(req.body.sortSelect === 'sLName' && req.body.sortOrd === 'ASC') {
        users.find({}).sort('lastName').exec((err,docs)=>{
            res.render('users', {
                pageTitle: 'Ordered list Z>a',
                users: docs,
            });
        });
    }
    else if(req.body.sortSelect === 'sLName' && req.body.sortOrd === 'DSC') {
        users.find({}).sort({lastName: 'desc'}).exec((err,docs)=>{
            res.render('users', {
                pageTitle: 'Ordered list Z>a',
                users: docs,
            });
        });
    }
});

app.listen(port, ()=>{
    console.log('server on port ' + port);
})