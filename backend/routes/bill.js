const express = require('express');
const connection = require('../connection')
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../service/authentication');

router.post('/generateReport', auth.autheticateToken, (req, res) => {
    const generateUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);
    const query = "INSERT INTO bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    connection.query(query, [orderDetails.name, generateUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        ejs.renderFile(path.join(__dirname, 'report.ejs'), {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount
        }, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            pdf.create(result).toFile(`./generated_pdf/${generateUuid}.pdf`, (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                } else {
                    return res.status(200).json({ uuid: generateUuid });
                }
            });
        });
    });
});

router.post('/getPdf',auth.autheticateToken, (req, res, next) =>{
    let orderDetails = req.body;
    const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';
    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }else{
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname, 'report.ejs'), {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount
        }, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            pdf.create(result).toFile(`./generated_pdf/${orderDetails.uuid}.pdf`, (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                } else {
                    res.contentType("application/pdf");
                    fs.createReadStream(pdfPath).pipe(res);
                }
            });
        });
    }
});

router.get('/getBills',auth.autheticateToken, (req, res, next) =>{
    var query = "select * from bill order by id desc";
    connection.query(query, (err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    }
)});

router.delete('/delete/:id', auth.autheticateToken, (req, res, next) =>{
    let id = req.params.id;
    var query = "delete from bill where id=?";
    connection.query(query, [id], (err, results) =>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Bill não existe"});
            }else{
                return res.status(200).json({message: "Bill deletado."});
            }
        }else{
            return res.status(500).json(err);
        }
    })
});

module.exports = router;