const express = require('express');
var app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var port = process.env.port || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));

const mongodbUri = 'mongodb://127.0.0.1:27017/chatApp';

mongoose.connect( mongodbUri, { useNewUrlParser: true } )
        .then(() => console.log('DB Connected'))
        .catch((err) => console.log(err))

var Users = require('./routes/Users');
app.use('/users', Users);

app.listen(port, () => console.log('Server Running at port ' + port));