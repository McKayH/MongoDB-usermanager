const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3200

app.use(express.urlencoded({extended: false}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.get('/', (req, res)=>{
    res.render('newUser')
});

app.listen(port, ()=>{
    console.log('server on port ' + port);
})