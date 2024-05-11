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
    var query = "select P.id, P.name, P.description, P.price, P.status, C.id as categoryId, C.name as categoryName from product as P INNER JOIN category as C where P.categoryId = C.id";
    connection.query(query, (err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    }
)});

router.get('/getByCategory/:id',auth.autheticateToken, (req, res, next) =>{
    const id = req.params.id;
    var query = "select id, name from product where categoryId = ? and status = 'true'";
    connection.query(query, [id], (err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    }
)});

router.get('/getById/:id',auth.autheticateToken, (req, res, next) =>{
    const id = req.params.id;
    var query = "select id, name, description, price from product where id = ?";
    connection.query(query, [id], (err, results)=>{
        if(!err){
            return res.status(200).json(results[0]);
        }else{
            return res.status(500).json(err);
        }
    }
)});

router.patch('/update', auth.autheticateToken, checkRole.checkRole, (req, res, next) =>{
    let product = req.body;
    var query = "update product set name=?, categoryId=?, description=?, price=? where id=?";
    connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], (err, results) =>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Produto não existe"});
            }else{
                return res.status(200).json({message: "Produto atualizado."});
            }
        }else{
            return res.status(500).json(err);
        }
    })
});

router.delete('/delete/:id', auth.autheticateToken, checkRole.checkRole, (req, res, next) =>{
    let id = req.params.id;
    var query = "delete from product where id=?";
    connection.query(query, [id], (err, results) =>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Produto não existe"});
            }else{
                return res.status(200).json({message: "Produto deletado."});
            }
        }else{
            return res.status(500).json(err);
        }
    })
});

router.patch('/updateStatus', auth.autheticateToken, checkRole.checkRole, (req, res, next) =>{
    let product = req.body;
    var query = "update product set status=? where id=?";
    connection.query(query, [product.status, product.id], (err, results) =>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Produto não existe"});
            }else{
                return res.status(200).json({message: "Status do produto atualizado."});
            }
        }else{
            return res.status(500).json(err);
        }
    })
});

module.exports = router;