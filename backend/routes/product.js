const express = require('express');
const connection = require('../connection')
const router = express.Router();
var auth = require('../service/authentication');
var checkRole = require('../service/roleCheck');

router.post('/add',auth.autheticateToken, checkRole.checkRole, (req, res, next) =>{
    let product = req.body;
    query = "insert into product (name, categoryId, description, price, status) values (?, ?, ?, ?, 'true')"
    connection.query(query, [product.name, product.categoryId, product.description, product.price], (err, results) => {
        if(!err){
            return res.status(200).json({message: "Produto adicionado com sucesso"});
        }else{
            return res.status(500).json(err);
        }
    });
});

router.get('/get',auth.autheticateToken, (req, res, next) =>{
    var query = "select P.id, P.name, P.description, P.price, P.status, C.id as categoryId, C.name as categoryName from product as P INNER JOIN category as C where P.categoryId = cd.id";
    connection.query(query, (err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    }
)});

module.exports = router;