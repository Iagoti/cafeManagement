const express = require('express');
const connection = require('../connection')
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

var auth = require('../service/authentication');
var checkRole = require('../service/roleCheck');

router.post('/signup', (req, res) =>{
    let user = req.body;
    query = "select email, password, role, status from user where email=?"
    connection.query(query, [user.email], (err, results) => {
        if(!err){
            if(results.length <= 0){
                query = "insert into user(name, contactNumber, email, password, status, role) values(?, ?, ?, ?,'false', 'user')"
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if(!err){
                        return res.status(200).json({message: "Salvo com ucesso!"});
                    }else{
                        return res.status(500).json(err);
                    }
                });
            }else{
                return res.status(400).json({message: "Email ja existe"});
            }
        }else{
            return res.status(500).json(err);
        }
    });
});

router.post('/login', (req, res) =>{
    const user = req.body;
    query = "select email, password, role, status from user where email=?";
    connection.query(query, [user.email], (err, results)=>{
        if(!err){
            if(results.length <= 0 || results[0].password != user.password){
                return res.status(401).json({message: "Email ou senha incorreto"}); 
            }else if(results[0].status === 'false'){
                return res.status(401).json({message: "Aguarde a aprovação do administrador"}); 
            }else if(results[0].password == user.password){
                const response = {email: results[0].email, role: results[0].role};
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: '8h'});
                res.status(200).json({token: accessToken});
            }else{
                return res.status(400).json({message: "Algo deu errado. Por favor, tente novamente mais tarde"});
            }
        }else{
            return res.status(500).json(err);
        }
    })
});

router.get('/get',auth.autheticateToken, checkRole.checkRole, (req, res) =>{
    var query = "select id, name, contactNumber, status from user where role = 'user'";
    connection.query(query, (err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    }
)});

router.patch('/update', auth.autheticateToken, checkRole.checkRole, (req, res) =>{
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) =>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Usuário não existe"});
            }else{
                return res.status(200).json({message: "Usuário atualizado."});
            }
        }else{
            return res.status(500).json(err);
        }
    })
});

router.get('/checktoken', (req, res) =>{
    return res.status(200).json({message: "true"});
});

module.exports = router;