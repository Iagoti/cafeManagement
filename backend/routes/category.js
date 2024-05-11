const express = require('express');
const connection = require('../connection')
const router = express.Router();
var auth = require('../service/authentication');
var checkRole = require('../service/roleCheck');

router.post('/add',auth.autheticateToken, checkRole.checkRole, (req, res, next) =>{
    let category = req.body;
    query = "insert into category (name) values (?)"
    connection.query(query, [category.name], (err, results) => {
        if(!err){
            return res.status(200).json({message: "Categoria adicionada com sucesso"});
        }else{
            return res.status(500).json(err);
        }
    });
});

router.get('/get',auth.autheticateToken, (req, res, next) =>{
    var query = "select * from category order by name";
    connection.query(query, (err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    }
)});

router.patch('/update', auth.autheticateToken, checkRole.checkRole, (req, res, next) =>{
    let category = req.body;
    var query = "update category set name=? where id=?";
    connection.query(query, [category.name, category.id], (err, results) =>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Categoria não existe"});
            }else{
                return res.status(200).json({message: "Categoria atualizada."});
            }
        }else{
            return res.status(500).json(err);
        }
    })
});

module.exports = router;