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

    router.post('/', upload.single ("image"), (req, res)=>{
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


        if(req.file) message.image = req.file.filename;

        fileDb.addProduct(message).then(result =>{
            res.send(result);
        });

    });



    return router;
};


module.exports = createRouter;