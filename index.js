const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3200;

app.use(express.urlencoded({extended: false}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
const mongoose = require('mongoose');
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
        console.log(users);
        res.render('users', {
            pageTitle: 'List of users',
            users: users
        });
    });
});
app.get('/delete/:id', (req, res)=>{
    console.log(req.params.id);
    users.deleteOne({_id: req.params.id }).then(function(){
        console.log("Data deleted"); // Success
        res.redirect('back')
    }).catch(function(error){
        console.log(error); // Failure
    });
    
});

app.listen(port, ()=>{
    console.log('server on port ' + port);
})