const express = require('express');
const multer = require('multer');
const path = require("path");
const nanoid = require('nanoid');



const config = require('../config');


const storage = multer.diskStorage({
    destination(req, file, cd){
        cd(null, config.uploadPath)
    },
    filename(req, file, cd){
        cd(null, nanoid() + path.extname(file.originalname))
    }
});

const upload = multer({storage});


const router = express.Router();


const fileDb = require('../fileDb');

const createRouter = ()=>{


    router.get('/', (req, res) =>{
        res.send(fileDb.getData());
    });

    router.post('/', upload.single ("image"), (req, res)=>{
        const message = req.body;
        if(!message.description){
            res.send({code:404, message: 'Description error'});
            return;
        }
        if(!message.price){
            res.send({code:404, message: 'Price error'});
            return;
        }

        if(req.file) message.image = req.file.filename;

        fileDb.addProduct(message).then(result =>{
            res.send(result);
        });

    });
    router.post('/change',(req, res)=>{

        const product = req.body;
        if(!product.description || !product.description.length){
            res.send({code:404, message: 'Description error'});
            return;
        }
        if(!product.price || !product.price.length){
            res.send({code:404, message: 'Price error'});
            return;
        }

        fileDb.changeProduct(product).then(result =>{
            res.send(result);
        });
    });

    return router;
};


module.exports = createRouter;