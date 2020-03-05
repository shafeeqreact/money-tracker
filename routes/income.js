const express = require('express');
const router = express.Router();

const connectDB = require('../db/connectDB');

router.route('/')
    .get(async (req, res) => {
        try {
            const task = async (collection) => await collection.find().toArray();
            const resp = await connectDB(task);
            res.status(200).send(resp);
        } catch (err) {
            res.status(400).send({ success: false, error: err });
        }
    })
    .post(async (req, res) => {
        try {
            const task = async (collection) => await collection.insertOne(req.body);
            const resp = await connectDB(task);
            res.status(200).send(resp);
        } catch (err) {
            res.status(400).send({ success: false, error: err });
        }
    })

router.route('/:id')
    .get((req, res) => {
        res.status(200).send('From the get with id income router')
    })
    .put((req, res) => {
        res.status(200).send('From the put with id income router')
    })
    .delete((req, res) => {
        res.status(200).send('From the delete with id income router')
    })

module.exports = router;