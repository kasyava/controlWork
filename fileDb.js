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
    },

    changeProduct: (product) => {
        const id = data.findIndex(tmpProduct => tmpProduct.id === product.id);
        if(id>=0){
            data[id].name = product.name;
            data[id].description = product.description;
            data[id].price = product.price;

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
        else{
            return null;
        }
    }

};