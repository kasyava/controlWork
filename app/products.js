const express = require('express');
const router = express.Router();


const fileDb = require('../fileDb');

const createRouter = ()=>{

    router.get('/:date', (req, res)=>{
        if(req.params.date){
            res.send(fileDb.getDataByDate(req.params.date));
        }
        else{
            res.send({message: 'error'});
        }
    });


    router.get('/', (req, res) =>{
        res.send(fileDb.getData());
    });

    router.post('/', (req, res)=>{
        console.log(req.body);
        const message = req.body;
        if(!message.description){
            res.send({code:404, message: 'Description error'});
            return;
        }
        if(!message.price){
            res.send({code:404, message: 'Price error'});
            return;
        }

        fileDb.addProduct(message).then(result =>{
            res.send(result);
        });

    });



    return router;
};


module.exports = createRouter;