const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');

mongoose.connect('mongodb+srv://havanthai:' +
    process.env.MONGO_ATLAS_PW +
    '@cluster0-0qaku.mongodb.net/test?retryWrites=true&w=majority');

app.use(morgan('dev')); // Write log request in console
app.use(express.static('public'));  // Make folder can access public
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', '*');
        return res.status(200).json({});
    }

    next();
})

app.use('/products', productRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;