
const express = require('express');
const cors = require('cors');


const products = require('./app/products');
const fileDb = require('./fileDb');


const port = 8000;



const app =express();


app.use(express.json());
app.use(cors());


fileDb.init().then(()=>{
    console.log('Database was loaded');

    app.use('/products',products());
    app.listen(port, ()=>{
        console.log('server start on port: ' + port);
    });
});