const fs = require('fs');
const nanoid = require('nanoid');


let data = null;


module.exports={
    init: ()=>{

        return new Promise((resolve,reject) =>{
            fs.readFile('./products.json',(err, result)=>{
                if(err) reject();
                else{
                    data = JSON.parse(result);
                    resolve();
                }
            })
        });
    },
    getData: () => data,

    getDataByDate: (date)=>{
        const id = data.findIndex(product => product.date === date);
        if(id>=0){
            return data.slice(id+1);
        }
        else{
            return null;
        }
    },

    addProduct: (product) => {
        product.id = nanoid(8);
        product.date = new Date().toISOString();
        data.push(product);


        let contents = JSON.stringify(data, null, 2);

        return new Promise((resolve, reject) =>{
            fs.writeFile('./products.json', contents, err =>{
                if(err) reject();
                else{
                    resolve(product);
                }
            });
        });
    }

};