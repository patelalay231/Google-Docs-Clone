const express = require('express');
const router = express.Router();
const documentSchema = require('../schemas/document-schema');
const userSchema = require('../schemas/user-schema');
const {AuthMiddleWare} = require('../middlewares/authmiddlerware');

router.post('/create-document', AuthMiddleWare, async (req, res,next) => {
    try {
        const document = await documentSchema.create({userId: req.userId,username: req.username});
        res.status(200).send({message: 'Document Created', documentId:document.id});
    } catch (err) {
        next(err);
    }
});

router.get('/get-documents', AuthMiddleWare, async (req, res,next) => {
    try {
        const documents = await documentSchema.find({userId: req.userId});
        const sharedDocuments = await documentSchema.find({sharedWith: req.userId});
        res.status(200).send({documents: documents, sharedDocuments: sharedDocuments});
    } catch (err) {
        next(err);
    }
});



module.exports = router;